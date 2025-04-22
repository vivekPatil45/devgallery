'use client';

import { useUser } from "@/context/UserContext";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaGithub, FaEdit, FaTrash, FaEye, FaLink, FaFolderOpen, FaSearch, FaFilter } from "react-icons/fa";
import { techStackList } from "@/utils/constants";

interface Project {
    _id: string;
    title: string;
    description: any;
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

const MyProjectsPage = () => {
    const { user } = useUser();
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");
    const [techFilter, setTechFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const projectsPerPage = 5;

    useEffect(() => {
        const fetchProjects = async () => {
        try {
            const response = await axios.get(`/api/projects/my-projects?userId=${user?._id}`);
            setProjects(response.data.projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
        };

        if (user?._id) fetchProjects();
    }, [user]);

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

    const deleteProject = (id: string) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        const deletePromise = axios.delete(`/api/projects/${id}`);

        toast.promise(deletePromise, {
        loading: "Deleting project...",
        success: () => {
            setProjects((prev) => prev.filter((p) => p._id !== id));
            return "Project deleted successfully";
        },
        error: (err: any) => err.response?.data?.message || "Error deleting project",
        });
    };

    const uniqueTechStack = [...new Set(projects.flatMap((p) => p.techStack))];

    return (
        <div>
            <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent flex items-center justify-center gap-2 mb-6">
                <FaFolderOpen className="text-primary" />
                My Projects
            </h1>

            {/* Search and Filter */}
            <div className="flex flex-wrap justify-between items-center my-4 gap-4">
                <label className="input input-bordered flex items-center gap-2 w-full max-w-md">
                    <FaSearch className="text-base-content/60" />
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2 max-w-xs">
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

            {/* Loader */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-200 p-4 rounded-lg shadow-md">
                <table className="table w-full">
                    <thead>
                    <tr className="text-base-content/60 text-base">
                        <th>#</th>
                        <th>Title</th>
                        <th>Likes</th>
                        <th>Comments</th>
                        <th>GitHub</th>
                        <th>Live</th>
                        <th>Tech Stack</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentProjects.length > 0 ? (
                        currentProjects.map((project, index) => (
                        <tr key={project._id} className="text-base-content/80 text-base">
                            <td>{indexOfFirst + index + 1}</td>
                            <td>{project.title}</td>
                            <td>{project.likes?.length ?? 0}</td>
                            <td>{project.comments?.length ?? 0}</td>
                            <td>
                                <a 
                                    href={project.githubUrl || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={project.githubUrl ? "" : "pointer-events-none opacity-50"}
                                >
                                    <FaGithub className="text-xl text-primary hover:scale-110 transition-transform" />
                                </a>
                            </td>
                            <td>
                                <a 
                                    href={project.liveUrl || "#"}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={project.liveUrl ? "" : "pointer-events-none opacity-50"}
                                >
                                    <FaLink className="text-xl text-primary hover:scale-110 transition-transform" />
                                </a>
                            </td>
                            <td>
                            <div className="flex flex-wrap gap-1">
                                {project.techStack.slice(0, 2).map((tech, idx) => (
                                <span key={idx} className="badge badge-outline badge-primary text-xs">
                                    {tech}
                                </span>
                                ))}
                            </div>
                            </td>
                            <td className="flex gap-2">
                            <Link href={`/user/projects/edit/?id=${project._id}`} passHref>
                                <button className="btn btn-xs btn-primary">
                                <FaEdit />
                                </button>
                            </Link>
                            <Link href={`/user/projects/${project._id}`} passHref>
                                <button className="btn btn-xs btn-info">
                                <FaEye />
                                </button>
                            </Link>
                            <button className="btn btn-xs btn-error" onClick={() => deleteProject(project._id)}>
                                <FaTrash />
                            </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={8} className="py-10 text-center text-base-content/60">
                            <div className="flex flex-col items-center gap-2">
                            <FaFolderOpen className="text-4xl text-primary" />
                            <p className="text-lg font-medium">No projects found</p>
                            <p className="text-sm text-base-content/50">Try adjusting your search or filters</p>
                            </div>
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            )}

            <div className="flex justify-center items-center mt-10 flex-wrap gap-2">
            {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }, (_, i) => (
                <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
                >
                {i + 1}
                </button>
            ))}
            </div>

        </div>
    );
};

export default MyProjectsPage;
