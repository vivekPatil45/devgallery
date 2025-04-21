'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'draft-js';
import {
    FaGithub,
    FaLink,
    FaHeart,
    FaTools,
    FaAlignLeft,
    FaComments,
} from 'react-icons/fa';
import 'draft-js/dist/Draft.css';
import { formatTimeAgo } from '@/utils/constants';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';
interface User {
    _id: string;
    name: string;
    profileImage: string;
}

interface Like {
    _id: string;
    userId: string;
}

interface Comment {
    _id: string;
    text: string;
    authorId: User;
    createdAt:Date
}

interface Project {
    _id: string;
    title: string;
    image: string;
    description: string;
    githubUrl?: string;
    liveUrl?: string;
    techStack: string[];
    authorId: User;
    likes: Like[];
    comments: Comment[];
    createdAt?: string;
    updatedAt?: string;
}
const defaultProject: Project = {
    _id: "",
    title: "",
    image: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    techStack: [],
    authorId: {
        _id: "",
        name: "",
        profileImage: "",
    },
    likes: [],
    comments: [],
    createdAt: "",
    updatedAt: "",
};

const ViewProjectPage = () => {
    const { id } = useParams();
    const { user } = useUser();

    const userId = user?._id?.toString();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [project, setProject] = useState<Project>(defaultProject);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`/api/projects/${id}`);
                const data = res.data.project;
                setProject(data);
                setLikeCount(data.likes.length || 0);
                if (userId) {
                    const isLiked = data.likes.some((like: Like) => like.userId === userId);
                    setLiked(isLiked);
                }

                if (data.description) {
                    const raw = typeof data.description === 'string'
                        ? JSON.parse(data.description)
                        : data.description;

                    const rawContent = convertFromRaw(raw);
                    setEditorState(EditorState.createWithContent(rawContent));
                }

            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        if (id) fetchProject();
    }, [id]);

    
    const handleLikeToggle = async () => {
        if (!userId) {
            alert('You must be logged in to like a project.');
            return;
        }
    
        try {
            const response = await axios.post('/api/projects/likes', {
                projectId: project._id,
                userId,
            });
    
            if (response.data.status === 'liked') {
                setLiked(true);
                setLikeCount(prev => prev + 1);
            } else if (response.data.status === 'unliked') {
                setLiked(false);
                setLikeCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };
    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(event.target.value);
    };

    const handlePostComment = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (!commentText.trim()) {
            toast.error('Please enter a comment');
            return;
        }
    
        if (!userId) {
            toast.error('You must be logged in to comment.');
            return;
        }
    
        const promise = axios.post('/api/projects/comments', {
            projectId: project._id,
            userId,
            text: commentText,
        });
    
        toast.promise(promise, {
            loading: 'Posting comment...',
            success: (res) => {
                const newComment: Comment = {
                    _id: res.data.comment._id,
                    text: commentText,
                    authorId: {
                        _id: userId,
                        name: user?.name?.toString() || 'Anonymous',
                        profileImage: user?.profileImage || '',
                    },
                    createdAt: new Date(),
                };
    
                setProject(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        comments: [...prev.comments, newComment],
                    };
                });
    
                setCommentText('');
                setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }, 200);
    
                return 'Comment posted successfully! ✅';
            },
            error: (err) =>
                err?.response?.data?.message || 'Failed to post comment ❌',
        });
    };
    
    
    

    if (!project) return <div className="text-center mt-10 text-lg text-gray-500">Loading project...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Header */}
            <div className=' flex items-center justify-between'>

                {/* Title and Author */}
                <div className="flex items-center gap-4 mb-4">
                    {/* Avatar */}
                    <img
                        src={project.authorId.profileImage || '/image.png'}
                        alt="Author"
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {project.title}
                        </h1>
                        <p className="text-sm text-base-content/70">by {project.authorId?.name || 'Anonymous'}</p>
                    </div>
                </div>

                {/* Total Likes */}
                    <button
                            onClick={handleLikeToggle}
                            className="flex items-center cursor-pointer gap-2 text-pink-600 font-semibold mb-6 hover:scale-105 transition-all"
                    >
                            <FaHeart className={`text-xl transition ${liked ? 'text-red-500' : 'text-base-content/50'}`} />
                        <span>{likeCount} </span>
                    </button>
            </div>

            {/* Image */}
            <img
                src={project.image}
                alt="project"
                className="w-full h-80 object-cover rounded-lg border-2 border-primary shadow-lg mb-8"
            />

            {/* Tech Stack */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-base-content mb-3 flex items-center gap-2">
                    <FaTools className="text-base-content" />
                    Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech: string, index: number) => (
                        <span
                            key={index}
                            className="badge badge-outline badge-lg px-4 py-2 text-sm badge-primary font-medium"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-base-content mb-3 flex items-center gap-2">
                    <FaAlignLeft className="text-base-content" />
                    Description
                </h2>
                <div className="border border-base-300 rounded-lg p-5 bg-base-100 shadow-md">
                    <Editor editorState={editorState} readOnly={true} onChange={() => {}} />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-4 mb-12">
                {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-primary gap-2"
                    >
                        <FaGithub />
                        GitHub
                    </a>
                )}
                {project.liveUrl && (
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-accent btn-outline gap-2"
                    >
                        <FaLink />
                        Live Demo
                    </a>
                )}
            </div>

            {/* Comment Section */}
            <div className="border-t pt-10">
                <h2 className="text-xl font-semibold text-base-content mb-4 flex items-center gap-2">
                    <FaComments className="text-base-content" />
                    Comments
                </h2>

                {/* Comments List (Static for demo) */}
                <div className="space-y-4 mb-6">
                    {project.comments.map((c, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-base-200 rounded-lg">
                            <img
                                src={c.authorId.profileImage ||" "}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-base-content">{c.authorId.name}</p>
                                <p className="text-sm text-base-content/80">{c.text}</p>
                                <p className="text-xs text-base-content/60 mt-1">
                                    {formatTimeAgo(c.createdAt)}
                                    
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Comment Input */}
                <form className="flex flex-col gap-3" onSubmit={handlePostComment}>
                    <textarea
                        className="textarea textarea-bordered resize-none h-24"
                        placeholder="Leave your comment..."
                        value={commentText}
                        onChange={handleCommentChange}
                    ></textarea>
                    <button className="btn btn-primary w-fit self-end">Post Comment</button>
                </form>
            </div>
        </div>
    );
};

export default ViewProjectPage;
