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
    FaProjectDiagram,
    FaTools,
    FaAlignLeft,
    FaComments,
} from 'react-icons/fa';
import 'draft-js/dist/Draft.css';
import { FaCode } from 'react-icons/fa6';






const ViewProjectPage = () => {
    const { id } = useParams();

    const [project, setProject] = useState<any>(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`/api/projects/${id}`);
                const data = res.data.project;
                setProject(data);

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
    console.log(project);
    

    if (!project) return <div className="text-center mt-10 text-lg text-gray-500">Loading project...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Header */}
            <div className=' flex items-center justify-between'>

                {/* Title and Author */}
                <div className="flex items-center gap-4 mb-4">
                    {/* Avatar */}
                    <img
                        src={project.author?.profileImage || '/image.png'}
                        alt="Author"
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {project.title}
                        </h1>
                        <p className="text-sm text-base-content/70">by {project.author?.name || 'Anonymous'}</p>
                    </div>
                </div>

                {/* Total Likes */}
                <div className="flex items-center gap-2 text-pink-600 font-semibold mb-6">
                    <FaHeart className="text-xl" />
                    <span>{project.totalLikes || 0} Likes</span>
                </div>
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
                    {[{
                        name: 'Jane Doe',
                        avatar: '/image.png',
                        comment: 'Really cool project! 🔥',
                        timestamp: new Date('2025-04-20T10:30:00')
                    }, {
                        name: 'John Smith',
                        avatar: '/image.png',
                        comment: 'I love the design and tech stack!',
                        timestamp: new Date('2025-04-21T09:00:00')
                    }].map((c, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-base-200 rounded-lg">
                            <img
                                src={c.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-base-content">{c.name}</p>
                                <p className="text-sm text-base-content/80">{c.comment}</p>
                                <p className="text-xs text-base-content/60 mt-1">
                                    {c.timestamp.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Comment Input */}
                <form className="flex flex-col gap-3">
                    <textarea
                        className="textarea textarea-bordered resize-none h-24"
                        placeholder="Leave your comment..."
                    ></textarea>
                    <button className="btn btn-primary w-fit self-end">Post Comment</button>
                </form>
            </div>
        </div>
    );
};

export default ViewProjectPage;
