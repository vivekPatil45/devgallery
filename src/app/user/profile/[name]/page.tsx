'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FaGithub,
    FaEye,
    FaLink,
    FaFilter,
    FaSearch,
    FaFolderOpen,
    FaTwitter,
    FaLinkedin
} from 'react-icons/fa';

interface SocialLinks {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
}

interface User {
    name: string;
    email: string;
    bio?: string;
    profileImage?: string;
    socialLinks: SocialLinks;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    githubUrl?: string;
    liveUrl?: string;
    techStack: string[];
    image?: string;
    authorId: string;
    likes: string[];
    comments: string[];
    createdAt: string;
    updatedAt: string;
}

const PublicUserProfilePage = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('id');

    const [user, setUser] = useState<User>();
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState('');
    const [techFilter, setTechFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const projectsPerPage = 5;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRes = await axios.get(`/api/user/${userId}`);
                const projectsRes = await axios.get(`/api/projects/my-projects?userId=${userId}`);
                setUser(userRes.data.user);
                setProjects(projectsRes.data.projects);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUserData();
    }, [userId]);

    const filteredProjects = projects.filter(
        (p) =>
            (p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())) &&
            (techFilter ? p.techStack.includes(techFilter) : true)
    );

    const indexOfLast = currentPage * projectsPerPage;
    const indexOfFirst = indexOfLast - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);
    const paginate = (page: number) => setCurrentPage(page);
    const uniqueTechStack = [...new Set(projects.flatMap((p) => p.techStack))];

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (!user) {
        return <p className="text-center text-error mt-10">User not found.</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Profile Section */}
            <div className="bg-base-200 p-6 rounded-xl shadow-md mb-8 flex flex-col sm:flex-row items-center gap-6">
                <Image
                    src={user.profileImage || '/default-avatar.png'}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-primary "
                />
                <div>
                    <h2 className="text-3xl font-bold text-primary">{user.name}</h2>
                    <p className="text-base-content/80 mt-2">{user.bio || 'No bio available.'}</p>
                    <div className="flex gap-5 mt-3 text-2xl text-primary">
                        {user.socialLinks?.github && (
                            <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                <FaGithub />
                            </a>
                        )}
                        {user.socialLinks?.linkedin && (
                            <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                <FaLinkedin />
                            </a>
                        )}
                        {user.socialLinks?.twitter && (
                            <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                <FaTwitter />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-lg font-semibold mb-6 text-primary">
                <FaFolderOpen className="text-2xl" />
                <span>
                    <span className="text-primary">{projects.length}</span> Project{projects.length !== 1 ? 's' : ''}
                </span>
            </div>


            {/* Filters */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <label className="input input-bordered flex items-center gap-2 w-full max-w-md shadow-sm">
                    <FaSearch className="text-base-content/60" />
                    <input
                        type="text"
                        className="grow bg-transparent"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2 max-w-xs shadow-sm">
                    <FaFilter className="text-base-content/60" />
                    <select
                        className="grow bg-base-100"
                        value={techFilter}
                        onChange={(e) => setTechFilter(e.target.value)}
                    >
                        <option value="">All Tech Stacks</option>
                        {uniqueTechStack.map((tech, i) => (
                            <option key={i} value={tech}>
                                {tech}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Projects Table */}
            <div className="overflow-x-auto bg-base-200 p-4 rounded-lg shadow">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="text-base-content/60 text-base">
                            <th>#</th>
                            <th>Title</th>
                            <th>Likes</th>
                            <th>Comments</th>
                            <th>GitHub</th>
                            <th>Live</th>
                            <th>Tech Stack</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProjects.length > 0 ? (
                            currentProjects.map((project, index) => (
                                <tr key={project._id}>
                                    <td>{indexOfFirst + index + 1}</td>
                                    <td className="font-medium">{project.title}</td>
                                    <td>{project.likes?.length ?? 0}</td>
                                    <td>{project.comments?.length ?? 0}</td>
                                    <td>
                                        <a href={project.githubUrl || '#'} target="_blank" rel="noopener noreferrer">
                                            <FaGithub className="text-xl text-primary hover:text-info" />
                                        </a>
                                    </td>
                                    <td>
                                        <a href={project.liveUrl || '#'} target="_blank" rel="noopener noreferrer">
                                            <FaLink className="text-xl text-primary hover:text-info" />
                                        </a>
                                    </td>
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {project.techStack.slice(0, 2).map((tech, idx) => (
                                                <span key={idx} className="badge badge-outline badge-primary badge-sm text-xs">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <Link href={`/user/projects/${project._id}`}>
                                            <button className="btn btn-xs btn-primary">
                                                <FaEye />
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-10">
                                    <div className="flex flex-col items-center gap-2">
                                        <FaFolderOpen className="text-4xl text-primary" />
                                        <p className="text-lg font-medium">No projects found</p>
                                        <p className="text-sm text-base-content/50">Try different filters or search</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredProjects.length > projectsPerPage && (
                <div className="flex justify-center mt-12 gap-2">
                    {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`btn btn-sm rounded-full transition-all duration-200 ${
                                currentPage === i + 1 ? 'btn-primary' : 'btn-outline'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
};

export default PublicUserProfilePage;
