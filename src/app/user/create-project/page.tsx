"use client";
import React, { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { useUser } from "@/context/UserContext";
import "draft-js/dist/Draft.css";
import { techStackList } from "@/utils/constants";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import DraftEditor from "@/components/Editor";
import { FaPlusCircle } from "react-icons/fa";
import Image from "next/image";

const CreateProject = () => {
    const { user } = useUser();
    const router = useRouter();
    
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<EditorState>(EditorState.createEmpty());
    const [githubUrl, setGithubUrl] = useState<string>("");
    const [liveUrl, setLiveUrl] = useState<string>("");
    const [techStack, setTechStack] = useState<string[]>([]);
    const [newTechInput, setNewTechInput] = useState<string>("");
    const [image, setImage] = useState<string>("/bg.png");
    const [imagePreview, setImagePreview] = useState<string>("/bg.png");

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files[0]) return;

        const file = files[0];
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size exceeds 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const formDataImage = new FormData();
        formDataImage.append("file", file);

        const uploadPromise = axios.post("/api/helper/upload-img", formDataImage);

        toast.promise(uploadPromise, {
            loading: "Uploading Image...",
            success: (res) => {
                const uploadedUrl = res.data.data.url;
                setImage(uploadedUrl);
                return "Image Uploaded Successfully!";
            },
            error: "Failed to upload image.",
        });
    };

    const handleAddTechStack = (tech: string) => {
        if (tech && !techStack.includes(tech)) {
            setTechStack((prev) => [...prev, tech]);
        }
        setNewTechInput("");
    };

    const handleRemoveTechStack = (index: number,e:React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); 
        const updatedTechStack = [...techStack];
        updatedTechStack.splice(index, 1);
        setTechStack(updatedTechStack);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const descriptionRaw = convertToRaw(description.getCurrentContent());
        const formattedDescription = JSON.stringify(descriptionRaw);

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
            image,
            authorId: user._id,
        };

        try {
            const response = axios.post("/api/projects/create-project", payload);

            toast.promise(response, {
                loading: "Creating project...",
                success: () => {
                    router.push("/user/my-projects");
                    return "Project created successfully!";
                },
                error: (err: unknown) => err.response?.data?.message || "Failed to create project",
            });
        } catch (error) {
            console.error("Project creation error:", error);
            toast.error("An unexpected error occurred");
        }
    };

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
                <p className="text-base-content/70 mt-2 text-sm">
                    Share your amazing work with the developer community
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    placeholder="Project Title"
                    className="input input-bordered w-full p-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <DraftEditor description={description} setDescription={setDescription} />

                <div>
                    <h2 className="text-lg font-semibold mb-4">Tech Stack</h2>
                    <hr className="mb-4" />
                    <div className="bg-base-200 p-4 rounded-lg shadow-md">
                        {techStack.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech, index) => (
                                    <div key={index} className="badge badge-outline badge-primary text-xs">
                                        {tech}
                                        <button
                                            type="button"
                                            className="ml-1 text-red-500 hover:text-red-700"
                                            onClick={(e) => handleRemoveTechStack(index,e)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-primary">No tech stack added yet.</p>
                        )}

                        <div className="relative mt-4">
                            <input
                                type="text"
                                placeholder="Search or add tech stack"
                                value={newTechInput}
                                onChange={(e) => setNewTechInput(e.target.value)}
                                className="input input-bordered w-full"
                            />
                            {newTechInput && (
                                <div className="absolute top-full mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                                    {filteredTechStack.map((tech) => (
                                        <div
                                            
                                            key={tech}
                                            className="p-2 cursor-pointer hover:bg-base-200"
                                            onClick={(e) => handleAddTechStack(tech,e)}
                                        >
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="GitHub URL"
                    className="input input-bordered w-full p-3"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Live URL"
                    className="input input-bordered w-full p-3"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                />

                <div>
                    <label className="block mb-2 font-semibold">Project Image</label>
                    {/* <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-xl mb-2" /> */}
                    <Image
                        src={imagePreview}
                        alt="Preview"
                        width={160}    // Define the width of the image
                        height={160}   // Define the height of the image
                        className="object-cover rounded-xl mb-2"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input file-input-bordered w-full"
                    />
                </div>

                <button className="btn btn-primary w-full py-3 font-bold text-white" type="submit">
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
