"use client";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { useUser } from '@/context/UserContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import axios,{AxiosResponse} from "axios";
import { techStackList } from "@/utils/constants";
import DraftEditor from "@/components/Editor";
import Image from "next/image";

const EditProject = () => {
    const { user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<EditorState>(EditorState.createEmpty());
    const [githubUrl, setGithubUrl] = useState<string>("");
    const [liveUrl, setLiveUrl] = useState<string>("");
    const [techStack, setTechStack] = useState<string[]>([]);
    const [newTechInput, setNewTechInput] = useState<string>("");
    const [image, setImage] = useState<string>("");

    const projectId = searchParams?.get("id");
    
    useEffect(() => {
        if (!projectId) {
            toast.error("No project ID found.");
            return;
        }
    
        // Fetch project data when the component is mounted
        const fetchProjectData = async () => {
            try {
                const response: AxiosResponse = await axios.get(`/api/projects/${projectId}`);
    
                const project = response.data.project;
                console.log("Project description:", project.description);
    
                setTitle(project.title);
                setGithubUrl(project.githubUrl || "");
                setLiveUrl(project.liveUrl || "");
                setTechStack(project.techStack || []);
                setImage(project.image || "");
            
    
                // Check if description exists and is valid
                if (project.description) {
                    try {
                        // Parse the stringified JSON from MongoDB and convert to EditorState
                        const descriptionRaw = JSON.parse(project.description);
                        const descriptionState = convertFromRaw(descriptionRaw);
                        setDescription(EditorState.createWithContent(descriptionState));
                    } catch (error) {
                        console.error("Error parsing project description:", error);
                        setDescription(EditorState.createEmpty()); // Fallback for JSON parsing errors
                    }
                } else {
                    setDescription(EditorState.createEmpty()); // Fallback if no description
                }
    
            } catch (error) {
                console.error("Error fetching project data:", error);
                toast.error("Failed to load project data.");
            }
        };
    
        fetchProjectData();
    }, [projectId]);
    

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    // Tech Stack Logic
    const handleAddTechStack = (tech: string) => {
        if (tech && !techStack.includes(tech)) {
            setTechStack((prevTechStack) => [...prevTechStack, tech]);
        }
        setNewTechInput(""); // Clear the input field after selecting a tech stack
    };

    const handleRemoveTechStack = (index: number) => {
        const updatedTechStack = [...techStack];
        updatedTechStack.splice(index, 1);
        setTechStack(updatedTechStack);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const descriptionRaw = convertToRaw(description.getCurrentContent());
        const formattedDescription = JSON.stringify(descriptionRaw);

        // Validate required fields
        if (!title || !formattedDescription || !techStack.length || !user?._id) {
            toast.error("Please fill all the required fields");
            return;
        }

        const payload = {
            title,
            description: formattedDescription,
            githubUrl,
            liveUrl,
            techStack,
            image: image ,
            authorId: user._id,
        };

        try {
            toast.promise(
                axios.put(`/api/projects/${projectId}`, payload),
                {
                    loading: "Updating project...",
                    success: () => {
                        router.push("/user/my-projects");
                        return "Project updated successfully!";
                    },
                    error: (err: unknown) =>
                        err.response?.data?.message || "Failed to update project",
                }
            );
        
        } catch (error) {
            console.error("Project update error:", error);
            toast.error("An unexpected error occurred");
        }
    };

    // Filter tech stack options based on user input
    const filteredTechStack = techStackList.filter((tech) =>
        tech.toLowerCase().includes(newTechInput.toLowerCase())
    );


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-primary">Edit Project</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    placeholder="Project Title"
                    className="input input-bordered w-full p-3 rounded-lg border-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <DraftEditor description={description} setDescription={setDescription}/>

                {/* Tech Stack section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Tech Stack</h2>
                    <hr className="mb-4" />
                    <div className="bg-base-200 p-4 rounded-lg shadow-md">
                        <div className="space-y-3">
                            {techStack.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech, index) => (
                                        <div key={index} className="badge badge-outline badge-primary text-xs flex items-center gap-1">
                                            {tech}
                                            <button
                                                className="ml-1 text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveTechStack(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No tech stack added yet.</p>
                            )}

                            {/* Tech Stack Input with suggestions */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search or add tech stack"
                                    value={newTechInput}
                                    onChange={(e) => setNewTechInput(e.target.value)}
                                    className="input input-bordered flex-grow"
                                />
                                {newTechInput && (
                                    <div className="absolute top-full mt-2 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                                        {filteredTechStack.map((tech) => (
                                            <div
                                                key={tech}
                                                className="p-2 cursor-pointer hover:bg-base-200"
                                                onClick={() => handleAddTechStack(tech)}
                                            >
                                                {tech}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* GitHub URL */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="GitHub URL"
                        className="input input-bordered w-full p-3 rounded-lg border-2"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                    />
                </div>

                {/* Live URL */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Live URL"
                        className="input input-bordered w-full p-3 rounded-lg border-2"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                    />
                </div>

                <div>
                <label className="block mb-2">Project Image</label>
                        {image && image !== "" ? (
                            <Image
                                src={image}
                                alt="preview"
                                width={160}
                                height={160}
                                className="w-40 h-40 object-cover rounded-xl mb-2"
                            />
                        ) : (
                            <div className="w-40 h-40 bg-gray-200 rounded-xl mb-2">No Image</div> // Optional: fallback UI
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                        />
                </div>

                <button className="btn btn-primary w-full py-3 rounded-lg text-white font-bold" type="submit">
                    Update Project
                </button>
            </form>
        </div>
    );
}

export default EditProject
