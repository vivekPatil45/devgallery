'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectCard from '@/components/ProjectCard';
import { FaSearch, FaFilter, FaFolderOpen, FaRegSadTear } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

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
  

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState('');
    const [techFilter, setTechFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const projectsPerPage = 6;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('/api/projects');
                setProjects(res.data.projects || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(
        (p) =>
            (p.title.toLowerCase().includes(search.toLowerCase()) ||
                (typeof p.description === 'string' && p.description.toLowerCase().includes(search.toLowerCase()))) &&
            (techFilter ? p.techStack.includes(techFilter) : true)
    );

    const indexOfLast = currentPage * projectsPerPage;
    const indexOfFirst = indexOfLast - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);

    const paginate = (page: number) => setCurrentPage(page);

    const allTechs = Array.from(new Set(projects.flatMap((p) => p.techStack)));

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Heading */}
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent inline-flex items-center gap-3">
                    <FaFolderOpen className="text-primary text-4xl" />
                    Explore Projects
                </h1>
                <p className="text-base-content/70 mt-2 text-md">Discover amazing creations from the community</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="relative w-full md:max-w-md">
                    <FaSearch className="absolute  z-10 left-3 top-3 text-base-content/50 text-md" />
                    <input
                        type="text"
                        placeholder="Search by title or description..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="input input-bordered w-full pl-10 shadow-sm"
                    />
                </div>

                <div className="relative w-full md:max-w-xs">
                    <FaFilter className="absolute z-10 left-3 top-3 text-base-content/50 text-md" />
                    <select
                        value={techFilter}
                        onChange={(e) => {
                            setTechFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="select select-bordered w-full pl-10 shadow-sm"
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

            {/* Loading Spinner */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[250px] animate-fade-in">
                    <ImSpinner2 className="animate-spin text-5xl text-primary" />
                </div>
            ) : currentProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-24 text-center animate-fade-in">
                    <FaRegSadTear className="text-6xl text-primary mb-4" />
                    <h2 className="text-2xl font-semibold text-primary">No Projects Found</h2>
                    <p className="text-base-content/70 text-sm mt-2">Try changing your filters or search terms.</p>
                </div>
            ) : (
                <>
                    {/* Project Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {currentProjects.map((project) => (
                            <div key={project._id} className="transition-transform hover:scale-[1.02]">
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {filteredProjects.length > projectsPerPage && (
                        <div className="flex justify-center mt-12 gap-2">
                            {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    className={`btn btn-sm ${
                                        currentPage === i + 1 ? 'btn-primary' : 'btn-outline'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProjectsPage;
