'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaGithub, FaHeart, FaLink } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    image: string;
    authorId: {
      _id: string;
      name: string;
    };
    githubUrl?: string;
    liveUrl?: string;
    techStack: string[];
    likes: {
      _id: string;
      userId: string;
    }[];
  };
}

const ProjectCard: React.FC<{ project: ProjectCardProps['project'] }> = ({ project }) => {
    const { user } = useUser();
    const userId = user?._id?.toString();

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(project.likes.length);

    useEffect(() => {
        if (userId) {
            const isLiked = project.likes.some((like) => like.userId === userId);
            setLiked(isLiked);
        }
    }, [userId, project.likes]);

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
            setLikeCount((prev) => prev + 1);
            toast.success('You liked the project 💖');
        } else if (response.data.status === 'unliked') {
            setLiked(false);
            setLikeCount((prev) => Math.max(0, prev - 1)); // Prevent going below 0
            toast('You unliked the project', { icon: '💔' });
        }
        } catch (error) {
        console.error('Error toggling like:', error);
        }
    };

    return (
        <div className="card bg-base-200 border border-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden text-base-content/70">
            <figure>
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-t-xl" />
            </figure>

            <div className="card-body p-6">
                <div className="flex justify-between items-center">
                <h2 className="card-title text-2xl font-semibold">{project.title}</h2>
                <button onClick={handleLikeToggle} className="flex cursor-pointer items-center gap-1 text-secondary">
                    <FaHeart className={`transition-all ${liked ? 'text-red-500' : 'text-base-content/50'}`} />
                    <span className="text-sm">{likeCount}</span>
                </button>
                </div>

                <div className="mt-1 flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                    <span key={index} className="badge badge-outline badge-primary text-[11px]">
                    {tech}
                    </span>
                ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                <Link
                    href={`/user/profile/${project.authorId.name}?id=${project.authorId._id}`}
                    className="flex items-center gap-2 text-lg font-semibold text-base-content/70"
                >
                    <img
                    alt="Profile"
                    src="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740"
                    className="w-8 rounded-full"
                    />
                    {project.authorId.name || 'User'}
                </Link>

                <div className="flex gap-2">
                    {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        className="btn btn-sm btn-accent btn-circle btn-outline text-lg hover:bg-accent-focus"
                    >
                        <FaGithub />
                    </a>
                    )}
                    {project.liveUrl && (
                    <a
                        href={project.liveUrl}
                        className="btn btn-sm btn-accent btn-circle btn-outline text-lg hover:bg-accent-focus"
                    >
                        <FaLink />
                    </a>
                    )}
                </div>
                </div>

                <div className="mt-2">
                <Link
                    href={`/user/projects/${project._id}`}
                    className="btn btn-sm btn-primary btn-outline w-full rounded-lg hover:bg-primary-focus"
                >
                    View Project
                </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
