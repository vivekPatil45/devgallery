import { IconCheck } from "@tabler/icons-react";

export default function About() {
    return (
        <section className="bg-base-200 flex items-center justify-center py-16 px-6">
            <div className="max-w-4xl text-center">
                {/* Header Section */}
                <h1 className="text-5xl font-extrabold text-primary mb-4">
                About <span className="text-secondary">Dev Gallary</span>
                </h1>
                <p className="text-xl text-base-content/70 font-medium">
                A Platform Built for Developers to Showcase, Discover, and Get Inspired.
                </p>

                {/* Main Content */}
                <div className="mt-10 p-8 bg-base-100 shadow-xl rounded-2xl">
                <p className="text-lg text-base-content/80 leading-relaxed">
                    Dev Gallary is a dynamic hub for developers to share their web projects, 
                    explore innovative creations by others, and connect with like-minded 
                    enthusiasts. Whether you're building passion projects, professional 
                    portfolios, or experimental ideas, Dev Gallary is your space to shine.
                </p>

                {/* Key Features */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-secondary mb-4">Key Features</h2>
                    <ul className="space-y-3 text-left mx-auto max-w-2xl">
                    {[
                        "Showcase your web projects with descriptions and live links",
                        "Explore a wide range of creative and functional web apps",
                        "Search and filter projects by category or tech stack",
                        "Responsive and modern UI using Tailwind and DaisyUI",
                        "User authentication and personalized profiles",
                        "Engage with the developer community through shared inspiration",
                    ].map((feature, index) => (
                        <li key={index} className="flex items-center text-lg text-base-content/80">
                        <IconCheck className="text-primary mr-2" size={24} />
                        {feature}
                        </li>
                    ))}
                    </ul>
                </div>
                </div>

                {/* Final Call to Action */}
                <p className="mt-8 text-lg text-base-content/80">
                Whether you're a seasoned developer or just getting started, Dev Gallary 
                provides the perfect space to display your work and discover the potential 
                of the developer community.
                </p>
            </div>
        </section>
    );
}
