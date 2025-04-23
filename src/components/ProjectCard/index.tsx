'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaGithub, FaHeart, FaLink } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    image: string;
    authorId: {
      _id: string;
      name: string;
      profileImage: string;
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

  console.log("project",project);
  console.log("Useid",userId);

  
  useEffect(() => {
    if (userId) {
      const isLiked = project.likes.some((like) => like.userId === userId);
      console.log("liked",isLiked);
      
      setLiked(isLiked);
    }
  }, [userId, project.likes]);

  const handleLikeToggle = async () => {
    if (!userId) {
      toast.error('You must be logged in to like a project.');
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
        setLikeCount((prev) => Math.max(0, prev - 1));
        toast('You unliked the project', { icon: '💔' });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="card bg-base-200 border border-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden text-base-content/70 h-[450px] flex flex-col hover:scale-[1.03] transform ">
      <figure className="h-48 overflow-hidden relative rounded-t-xl">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </figure>

      {/* Content */}
      <div className="card-body p-5 flex flex-col flex-1 justify-between">
        {/* Title + Like */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-base-content line-clamp-2">{project.title}</h2>
          <button onClick={handleLikeToggle} className="text-secondary flex items-center cursor-pointer gap-1 hover:text-red-500 transition">
            <FaHeart className={`transition-all ${liked ? 'text-red-500' : 'text-base-content/50'}`} />
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/40">
          {project.techStack.map((tech, index) => (
            <span key={index} className="badge badge-outline badge-primary text-xs px-3 py-1 rounded-full hover:bg-primary-focus transition-all">
              {tech}
            </span>
          ))}
        </div>

        {/* Author + Links */}
        <div className="flex justify-between items-center mt-4">
          <Link
            href={`/user/profile/${project.authorId.name}?id=${project.authorId._id}`}
            className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition"
          >
            <div className="relative w-8 h-8">
              <Image
                alt="Profile"
                src={project.authorId.profileImage}
                fill
                className="rounded-full object-cover border-2 border-base-300 hover:scale-110 transition-all"
              />
            </div>
            {project.authorId.name || 'User'}
          </Link>

          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                className="btn btn-sm btn-circle btn-outline text-lg hover:bg-accent focus:bg-accent-focus transition-all"
              >
                <FaGithub />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                className="btn btn-sm btn-circle btn-outline text-lg hover:bg-accent focus:bg-accent-focus transition-all"
              >
                <FaLink />
              </a>
            )}
          </div>
        </div>

        {/* View Project Button */}
        <div className="mt-4">
          <Link
            href={`/user/projects/${project.title}?id=${project._id}`}
            className="btn btn-sm btn-primary w-full rounded-md hover:bg-primary-focus transition-all"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
