"use client";
import { useUser } from "@/context/UserContext";
import { techStackList } from "@/utils/constants";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaGithub, FaExternalLinkAlt, FaEdit, FaTrash, FaEye, FaLink, FaFolderOpen, FaSearch, FaFilter } from "react-icons/fa";

interface Project {
  _id: string;
  title: string;
  description: any; // Assuming it's stored in rich text JSON format
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

// const tempProjects: Project[] = [
//   {
//     id: "1",
//     title: "DevLinkNest",
//     description: "A hub for developer tools and free resources.",
//     likes: 120,
//     comments: 25,
//     github: "https://github.com/example/devlinknest",
//     live: "https://devlinknest.vercel.app",
//     techStack: ["Next.js", "Tailwind CSS", "MongoDB"],
//   },
//   {
//     id: "2",
//     title: "MedTrack",
//     description: "Medical record management system using Java.",
//     likes: 78,
//     comments: 14,
//     github: "https://github.com/example/medtrack",
//     live: "https://medtrack.vercel.app",
//     techStack: ["Java", "Servlet", "MySQL"],
//   },
//   {
//     id: "3",
//     title: "CodeCanvas",
//     description: "Showcase your websites & interact with others.",
//     likes: 200,
//     comments: 45,
//     github: "https://github.com/example/codecanvas",
//     live: "https://codecanvas.vercel.app",
//     techStack: ["React", "Firebase", "Tailwind CSS"],
//   },
//   {
//     id: "4",
//     title: "FitTrackPro",
//     description: "A fitness and nutrition tracking app.",
//     likes: 95,
//     comments: 18,
//     github: "https://github.com/example/fittrackpro",
//     live: "https://fittrackpro.vercel.app",
//     techStack: ["Vue.js", "Node.js", "Express", "MongoDB"],
//   },
//   {
//     id: "5",
//     title: "EduQuizzer",
//     description: "A quiz and learning platform for students.",
//     likes: 130,
//     comments: 22,
//     github: "https://github.com/example/eduquizzer",
//     live: "https://eduquizzer.vercel.app",
//     techStack: ["Angular", "Firebase", "Bootstrap"],
//   },
//   {
//     id: "6",
//     title: "TravelMate",
//     description: "Plan and share travel itineraries with ease.",
//     likes: 85,
//     comments: 19,
//     github: "https://github.com/example/travelmate",
//     live: "https://travelmate.vercel.app",
//     techStack: ["Next.js", "Supabase", "Tailwind CSS"],
//   },
//   {
//     id: "7",
//     title: "FinDash",
//     description: "Finance dashboard with analytics and insights.",
//     likes: 145,
//     comments: 29,
//     github: "https://github.com/example/findash",
//     live: "https://findash.vercel.app",
//     techStack: ["React", "D3.js", "Express", "PostgreSQL"],
//   },
//   {
//     id: "8",
//     title: "ResumeBuilderAI",
//     description: "Generate professional resumes with AI help.",
//     likes: 165,
//     comments: 32,
//     github: "https://github.com/example/resumebuilderai",
//     live: "https://resumebuilderai.vercel.app",
//     techStack: ["Next.js", "OpenAI API", "MongoDB"],
//   },
//   {
//     id: "9",
//     title: "InstaClone",
//     description: "Instagram clone with real-time chat.",
//     likes: 210,
//     comments: 60,
//     github: "https://github.com/example/instaclone",
//     live: "https://instaclone.vercel.app",
//     techStack: ["React", "Socket.IO", "Firebase", "Tailwind CSS"],
//   },
//   {
//     id: "10",
//     title: "DocuVault",
//     description: "Secure document storage and sharing system.",
//     likes: 72,
//     comments: 13,
//     github: "https://github.com/example/docuvault",
//     live: "https://docuvault.vercel.app",
//     techStack: ["Python", "Flask", "SQLite"],
//   },
//   {
//     id: "11",
//     title: "ShopEase",
//     description: "E-commerce platform with cart and payment features.",
//     likes: 180,
//     comments: 40,
//     github: "https://github.com/example/shopease",
//     live: "https://shopease.vercel.app",
//     techStack: ["MERN", "Redux", "Stripe API"],
//   },
//   {
//     id: "12",
//     title: "Taskify",
//     description: "Collaborative task management and to-do app.",
//     likes: 99,
//     comments: 16,
//     github: "https://github.com/example/taskify",
//     live: "https://taskify.vercel.app",
//     techStack: ["Svelte", "Node.js", "MongoDB"],
//   },
//   {
//     id: "13",
//     title: "BlogNest",
//     description: "Personal blogging platform with Markdown support.",
//     likes: 110,
//     comments: 20,
//     github: "https://github.com/example/blognest",
//     live: "https://blognest.vercel.app",
//     techStack: ["Next.js", "Prisma", "PostgreSQL"],
//   },
// ];


const MyProjectsPage = () => {
    const {user} = useUser();
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");
    const [techFilter, setTechFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const projectsPerPage = 5;
    
    useEffect(() => {
      const fetchProjects = async () => {
          const userId = user?._id; 
          try {
              const response = await axios.get(`/api/projects/my-projects?userId=${userId}`);
              setProjects(response.data.projects);
          } catch (error) {
              console.error("Error fetching projects:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchProjects();
    }, []);
    

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

        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;
        const deletePromise = axios.delete(`/api/projects/${id}`);

        toast.promise(deletePromise, {
            loading: "Deleting project...",
            success: () => {
            // Optimistically update the UI after deletion
            setProjects((prev) => prev.filter((p) => p._id !== id));
            return "Project deleted successfully";
            },
            error: (err:any) => err.response?.data?.message || "Error deleting project",
        });

    
    };


    // const uniqueTechStack = [...new Set(projects.flatMap((p) => p.techStack))];
    const uniqueTechStack = techStackList;
    return (
        <div>
            <h1 className="text-3xl font-bold text-center  text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent  flex items-center justify-center gap-2 mb-6">
                <FaFolderOpen className="text-primary" />
                My Projects
            </h1>

            <div className="flex flex-wrap justify-between items-center my-4 gap-4">
               {/* Search Input with Icon */}
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
                {/* Filter Dropdown with Icon */}
                <label className="input input-bordered flex items-center gap-2 max-w-xs">
                    <FaFilter className="text-base-content/60" />
                    <select
                    className="grow"
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
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <FaGithub className="text-xl text-primary hover:scale-110 transition-transform" />
                                </a>
                            </td>
                            <td>
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <FaLink className="text-xl text-primary hover:scale-110 transition-transform" />
                                </a>
                            </td>
                            <td>
                                <div className="flex flex-wrap gap-1">
                                {project.techStack.slice(0,2).map((tech, idx) => (
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
                                <button
                                    className="btn btn-xs btn-error"
                                    onClick={() => deleteProject(project._id)}
                                >
                                    <FaTrash />
                                </button>
                            </td>

                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={8} className="text-center py-4 text-base-content/50">
                        No projects found.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-4">
        <button
          className="btn btn-sm mx-2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg">Page {currentPage}</span>
        <button
          className="btn btn-sm mx-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLast >= filteredProjects.length}
        >
          Next
        </button>
      </div>
        </div>
    );
};

export default MyProjectsPage;
