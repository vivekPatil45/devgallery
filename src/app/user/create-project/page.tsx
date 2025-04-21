"use client";
import React, { useState } from "react";
import { EditorState, RichUtils, convertToRaw } from "draft-js";
import { useUser } from "@/context/UserContext";
import "draft-js/dist/Draft.css";
import { techStackList } from "@/utils/constants";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import DraftEditor from "@/components/Editor";
import { FaPlusCircle } from "react-icons/fa";

const defaultImage = "/bg.png"; // Replace with your default image



const CreateProject = () => {
    const { user } = useUser();
    // console.log(user);
    
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<EditorState>(EditorState.createEmpty());
    const [githubUrl, setGithubUrl] = useState<string>("");
    const [liveUrl, setLiveUrl] = useState<string>("");
    const [techStack, setTechStack] = useState<string[]>([]);
    const [newTechInput, setNewTechInput] = useState<string>("");
    const [image, setImage] = useState<string>(defaultImage);

    

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
        // const formattedDescription =descriptionRaw
    
        // Validate required fields
        if (!title || !formattedDescription || !techStack.length || !user?._id) {
            toast.error("Please fill all the required fields");
            return;
        }
    
        // Use a default image if none is provided
        const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmVzm1S8TmLAangS-uDMc6ks_q-rzqHdO1qg&s";
    
        const payload = {
            title,
            description: formattedDescription,
            githubUrl,
            liveUrl,
            techStack,
            image: defaultImage,
            authorId: user._id,
        };
    
        try {
            const response = axios.post("/api/projects/create-project", payload);
    
            toast.promise(response, {
                loading: "Creating project...",
                success: () => {
                    router.push("/user/my-projects"); // ✅ redirect after success
                    return "Project created successfully!";
                },
                error: (err: any) => err.response?.data?.message || "Failed to create project",
            });
        } catch (error) {
            console.error("Project creation error:", error);
            toast.error("An unexpected error occurred");
        }
    };

    // Filter tech stack options based on user input
    const filteredTechStack = techStackList.filter((tech) =>
        tech.toLowerCase().includes(newTechInput.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 inline-flex items-center gap-3 justify-center">
                    <FaPlusCircle className="text-blue-500 text-3xl" />
                    Create New Project
                </h1>
                <p className="text-base-content/70 mt-2 text-sm">Share your amazing work with the developer community</p>
            </div>
            
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
                    <img src={image} alt="preview" className="w-40 h-40 object-cover rounded-xl mb-2" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input file-input-bordered w-full"
                    />
                </div>

                <button className="btn btn-primary w-full py-3 rounded-lg text-white font-bold" type="submit">
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
