'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectCard from '@/components/ProjectCard';
import { FaSearch, FaFilter, FaFolderOpen } from 'react-icons/fa';


const ProjectsPage = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [techFilter, setTechFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('/api/projects');
                setProjects(res.data.projects || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
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
        <div className="max-w-7xl mx-auto p-6">
            {/* Heading */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent inline-flex items-center gap-3 justify-center">
                    <FaFolderOpen className="text-primary text-3xl" />
                    Explore Projects
                </h1>
                <p className="text-base-content/70 mt-2 text-sm">Discover projects from the community</p>
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
                    <FaFilter className="absolute  z-10 left-3 top-3 text-base-content/50 text-sm" />
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

            {/* Project Cards */}
            {currentProjects.length === 0 ? (
                <div className="text-center mt-10 text-gray-500">No projects found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProjects.map((project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {filteredProjects.length > projectsPerPage && (
                <div className="flex justify-center mt-10 gap-2">
                    {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
