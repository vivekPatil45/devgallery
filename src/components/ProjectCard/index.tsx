'use client';

import React from 'react';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaHeart } from 'react-icons/fa';
import { FiTwitter, FiFacebook } from 'react-icons/fi';
import { FaLink } from 'react-icons/fa';

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
    likes: string[]; // assuming this is an array of user IDs who liked
  };
}

const ProjectCard: React.FC<{ project: ProjectCardProps['project'] }> = ({ project }) => {

    return (
        <div className="card bg-base-200 border border-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden  text-base-content/70">
            <figure>
                <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover rounded-t-xl"
                />
            </figure>
            <div className="card-body p-6 ">
                <div className="flex justify-between items-center">
                    <h2 className="card-title text-2xl font-semibold ">{project.title}</h2>
                    <div className="flex items-center gap-1 text-secondary">
                        <FaHeart />
                        <span className="text-sm">{project.likes?.length || 0}</span>
                    </div>
                </div>

                {/* Tech Stack Section */}
                <div className="mt-1 flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                    
                    // <div class="badge badge-outline badge-primary">Primary</div>

                    <span
                    key={index}
                    className="badge badge-outline badge-primary text-[11px] "
                    >
                    {tech}
                    </span>
                ))}
                </div>

                {/* Footer Section with Author Info */}
                <div className="flex justify-between items-center mt-4">
                    <Link
                        href={`/user/profile/${project.authorId.name}?id=${project.authorId._id}`}
                        className="flex items-center gap-2 text-lg font-semibold  text-base-content/70"
                    >
                        <img alt="Profile" src="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740" className="w-8 rounded-full" />
                        {project.authorId.name || 'User'}
                    </Link>

                    <div className="flex gap-2">
                
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                className="btn btn-sm btn-accent  btn-circle btn-outline text-lg hover:bg-accent-focus"
                                // className="btn btn-accent btn-circle btn-sm text-lg text-accent-content hover:text-base-100"
                            >
                                <FaGithub />
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                className="btn btn-sm btn-accent  btn-circle btn-outline text-lg hover:bg-accent-focus"
                                // className="btn btn-accent btn-circle btn-sm text-lg text-accent-content hover:text-base-100"
                            >
                                <FaLink />
                            </a>
                        )}

                        
                    </div>
                </div>

                <div className="mt-2 ">
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
