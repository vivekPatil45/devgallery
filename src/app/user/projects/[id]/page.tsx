'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';

const ViewProjectPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState<any>(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`/api/projects/${id}`);
                const data = res.data.project;

                setProject(data);


                if (data.description) {
                    const raw = typeof data.description === "string"
                        ? JSON.parse(data.description)
                        : data.description;
    
                    const rawContent = convertFromRaw(raw);
                    setEditorState(EditorState.createWithContent(rawContent));
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        if (id) fetchProject();
    }, [id]);

    if (!project) return <div className="text-center mt-10">Loading project...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

            <img
                src={project.image}
                alt="project"
                className="w-full h-80 object-cover rounded-lg mb-6"
            />

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Tech Stack:</h2>
                <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech: string, index: number) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description:</h2>
                <div className="border border-gray-300 rounded-lg p-4">
                    <Editor editorState={editorState} readOnly={true} onChange={() => {}} />
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        GitHub
                    </a>
                )}
                {project.liveUrl && (
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                    >
                        Live Demo
                    </a>
                )}
            </div>
        </div>
    );
};

export default ViewProjectPage;
