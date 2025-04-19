import React from "react";

type Feature = {
    title: string;
    description: string;
    image: string;
};

const features: Feature[] = [
    {
        title: "Showcase Projects",
        description: "Easily display your web projects with beautiful layouts and details.",
        image: "/image/showcase.png",
    },
    {
        title: "Discover Creators",
        description: "Explore a wide variety of developer projects and portfolios.",
        image: "/image/discover.png",
    },
    {
        title: "Search & Filter",
        description: "Find projects by tech stack, category, or keywords in seconds.",
        image: "/image/search-filter.png",
    },
    {
        title: "Responsive Design",
        description: "Fully responsive UI built with Tailwind CSS and DaisyUI.",
        image: "/image/responsive.png",
    },
    {
        title: "Personal Profiles",
        description: "Create and customize your developer profile to highlight your work.",
        image: "/image/profile.png",
    },
    {
        title: "Engage & Connect",
        description: "Get inspired, share feedback, and build your network with fellow developers.",
        image: "/image/connect.png",
    },
];

const FeaturesPage: React.FC = () => {
    return (
        <section className="bg-base-200 py-12">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-extrabold text-base-content mb-6">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="card bg-base-100 shadow-xl p-6 flex flex-col items-center">
                    <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-28 h-28 object-contain mb-4"
                    />
                    <h3 className="text-xl font-bold mb-2 text-base-content">{feature.title}</h3>
                    <p className="text-base-content/70">{feature.description}</p>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesPage;
