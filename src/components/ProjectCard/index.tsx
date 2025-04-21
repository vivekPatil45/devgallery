'use client';

import React from 'react';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaHeart } from 'react-icons/fa';

interface ProjectCardProps {
    project: {
        _id: string;
        title: string;
        image: string;
        author: string;
        githubUrl?: string;
        liveUrl?: string;
        techStack: string[];
        likes: string[]; // assuming this is an array of user IDs who liked
    };
}

const ProjectCard: React.FC<{ project: ProjectCardProps['project'] }> = ({ project }) => {
    return (
        <div className="card bg-base-300 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <figure>
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                />
            </figure>
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <h2 className="card-title">{project.title}</h2>
                    <div className="flex items-center gap-1 text-red-600">
                        <FaHeart />
                        <span className="text-sm">{project.likes?.length || 0}</span>
                    </div>
                </div>

                <p className="text-sm text-gray-500">By: {project.author || 'Unknown'}</p>

                <div className="flex items-center gap-3 mt-2">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub className="text-2xl hover:text-gray-700" />
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaExternalLinkAlt className="text-2xl hover:text-green-600" />
                        </a>
                    )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack.map((tech, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mt-4">
                    <Link
                        href={`/user/projects/${project._id}`}
                        className="btn btn-sm btn-primary w-full"
                    >
                        View Project
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
