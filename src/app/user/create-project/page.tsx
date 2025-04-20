"use client";
import React, { useState } from "react";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import { useUser } from "@/context/UserContext";
import "draft-js/dist/Draft.css";
import { techStackList } from "@/utils/constants";
import toast from "react-hot-toast";
import axios from "axios";

const defaultImage = "/bg.png"; // Replace with your default image

interface CreateProjectProps {}

const CreateProject: React.FC<CreateProjectProps> = () => {
    const { user } = useUser();
    // console.log(user);
    
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<EditorState>(EditorState.createEmpty());
    const [githubUrl, setGithubUrl] = useState<string>("");
    const [liveUrl, setLiveUrl] = useState<string>("");
    const [techStack, setTechStack] = useState<string[]>([]);
    const [newTechInput, setNewTechInput] = useState<string>("");
    const [image, setImage] = useState<string>(defaultImage);

    // Predefined tech stack list
    console.log(description.getCurrentContent());
    

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleEditorChange = (editorState: EditorState) => {
        setDescription(editorState);
    };

    // Format buttons
    const handleBoldClick = () => {
        const newState = RichUtils.toggleInlineStyle(description, "BOLD");
        setDescription(newState);
    };

    const handleItalicClick = () => {
        const newState = RichUtils.toggleInlineStyle(description, "ITALIC");
        setDescription(newState);
    };

    const handleUnderlineClick = () => {
        const newState = RichUtils.toggleInlineStyle(description, "UNDERLINE");
        setDescription(newState);
    };

    const handleStrikethroughClick = () => {
        const newState = RichUtils.toggleInlineStyle(description, "STRIKETHROUGH");
        setDescription(newState);
    };

    const handleBulletListClick = () => {
        const newState = RichUtils.toggleBlockType(description, "unordered-list-item");
        setDescription(newState);
    };

    const handleNumberedListClick = () => {
        const newState = RichUtils.toggleBlockType(description, "ordered-list-item");
        setDescription(newState);
    };

    const handleHeadingClick = () => {
        const newState = RichUtils.toggleBlockType(description, "header-one");
        setDescription(newState);
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
                    // You can redirect or reset form here
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
            <h1 className="text-3xl font-bold mb-6 text-primary">Create New Project</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    placeholder="Project Title"
                    className="input input-bordered w-full p-3 rounded-lg border-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <div className="border-2 border-base-300 p-5 rounded-lg shadow-lg">
                    {/* Toolbar */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            type="button"
                            onClick={handleBoldClick}
                            className="btn btn-outline btn-sm text-xl font-bold text-primary hover:bg-primary-focus hover:text-white transition-all duration-300"
                        >
                            B
                        </button>
                        <button
                            type="button"
                            onClick={handleItalicClick}
                            className="btn btn-outline btn-sm text-xl font-semibold text-primary hover:bg-primary-focus hover:text-white transition-all duration-300"
                        >
                            I
                        </button>
                        <button
                            type="button"
                            onClick={handleUnderlineClick}
                            className="btn btn-outline btn-sm text-xl text-primary hover:bg-primary-focus hover:text-white transition-all duration-300"
                        >
                            U
                        </button>
                        <button
                            type="button"
                            onClick={handleStrikethroughClick}
                            className="btn btn-outline btn-sm text-xl text-primary hover:bg-primary-focus hover:text-white transition-all duration-300"
                        >
                            S
                        </button>
                        <button
                            type="button"
                            onClick={handleBulletListClick}
                            className="btn btn-outline btn-sm text-xl text-primary hover:bg-primary-focus hover:text-white transition-all duration-300"
                        >
                            •
                        </button>
                        <button
                            type="button"
                            onClick={handleNumberedListClick}
                            className="btn btn-outline btn-sm text-xl text-primary hover:bg-primary-focus hover:text-white transition-all duration-300"
                        >
                            1.
                        </button>
                        <button
                            type="button"
                            onClick={handleHeadingClick}
                            className="btn btn-outline btn-sm text-xl text-primary hover:bg-primary-focus hover:text-white transition-all duration-300"
                        >
                            H1
                        </button>
                    </div>

                    <hr className="text-base-content my-4" />

                    {/* Draft.js Editor */}
                    <div className="editor-container mb-6">
                        <Editor
                            editorState={description}
                            onChange={handleEditorChange}
                            placeholder="Enter detailed project description..."
                            className="border-2 border-base-300 p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                    </div>
                </div>

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
