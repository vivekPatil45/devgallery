"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "@/components/ProjectCard";
import { FaHeart, FaSearch, FaFilter, FaSadTear } from "react-icons/fa";
import { useUser } from "@/context/UserContext";

type Project = {
    _id: string;
    title: string;
    image: string;
    authorId: {
        _id: string;
        name: string;
        profileImage: string;
    };
    description: string;
    githubUrl?: string;
    liveUrl?: string;
    techStack: string[];
    likes: {
      _id: string;
      userId: string;
    }[]
  
};


const FavoriteProjectsPage = () => {
    const { user } = useUser();
    const userId = user?._id;
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");
    const [techFilter, setTechFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const projectsPerPage = 6;

    useEffect(() => {
        const fetchLikedProjects = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/projects/likes?id=${userId}`);
                setProjects(res.data.projects || []);
            } catch (error) {
                console.error("Error fetching liked projects:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchLikedProjects();
        }
    }, [userId]);
    console.log(projects);
    

    const filteredProjects = projects.filter(
        (p) =>
        (p.title.toLowerCase().includes(search.toLowerCase()) ||
            (typeof p.description === "string" &&
            p.description.toLowerCase().includes(search.toLowerCase()))) &&
        (techFilter ? p.techStack.includes(techFilter) : true)
    );

    const indexOfLast = currentPage * projectsPerPage;
    const indexOfFirst = indexOfLast - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);

    const paginate = (page: number) => setCurrentPage(page);

    const allTechs = Array.from(new Set(projects.flatMap((p) => p.techStack)));

    return (
        <div className="max-w-7xl mx-auto p-6">
        {/* Heading */}
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 inline-flex items-center gap-3 justify-center">
                <FaHeart className="text-pink-500 text-3xl" />
                Favorite Projects
            </h1>
            <p className="text-base-content/70 mt-2 text-sm">
                Projects you&#39;ve liked from the community
            </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:max-w-sm">
                <FaSearch className="absolute z-10 left-3 top-3 text-base-content/50 text-sm" />
                <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full pl-10"
                />
            </div>

            <div className="relative w-full md:max-w-xs">
                <FaFilter className="absolute z-10 left-3 top-3 text-base-content/50 text-sm" />
                <select
                    value={techFilter}
                    onChange={(e) => {
                    setTechFilter(e.target.value);
                    setCurrentPage(1);
                    }}
                    className="select select-bordered w-full pl-10"
                >
                    <option value="">All Tech Stacks</option>
                    {allTechs.map((tech, idx) => (
                    <option key={idx} value={tech}>
                        {tech}
                    </option>
                    ))}
                </select>
            </div>
        </div>

        {/* Loading State */}
        {loading ? (
            <div className="flex justify-center mt-20">
            <span className="loading loading-spinner text-pink-500 loading-lg"></span>
            </div>
        ) : currentProjects.length === 0 ? (
            // No Projects Found
            <div className="text-center mt-16 text-base-content/60 flex flex-col items-center justify-center gap-3">
                <FaSadTear className="text-6xl text-pink-400" />
                <h2 className="text-xl font-semibold">No favorite projects found</h2>
                <p className="text-sm max-w-md">
                    Looks like you haven&#39;t liked any projects yet. Explore projects and tap the
                    heart icon to add them here!
                </p>
            </div>
        ) : (
            // Project Cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
            ))}
            </div>
        )}

        {/* Pagination */}
        {!loading && filteredProjects.length > projectsPerPage && (
            <div className="flex justify-center mt-10 gap-2">
            {Array.from(
                { length: Math.ceil(filteredProjects.length / projectsPerPage) },
                (_, i) => (
                <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`btn btn-sm ${
                    currentPage === i + 1 ? "btn-primary" : "btn-outline"
                    }`}
                >
                    {i + 1}
                </button>
                )
            )}
            </div>
        )}
        </div>
    );
};

export default FavoriteProjectsPage;
