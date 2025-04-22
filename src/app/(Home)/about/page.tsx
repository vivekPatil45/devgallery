import { IconCheck, IconBrandGithub, IconLink, IconMail } from "@tabler/icons-react";

export default function About() {
    return (
        <section className="bg-base-200 flex items-center justify-center py-16 px-6 lg:px-16">
        <div className="max-w-7xl text-center">
            {/* Header Section */}
            <h1 className="text-5xl sm:text-6xl font-extrabold text-primary mb-6 md:mb-8">
            About <span className="text-secondary">DevGallary</span>
            </h1>
            <p className="text-xl sm:text-2xl text-base-content/70 font-medium max-w-3xl mx-auto mb-8">
            A Platform Built for Developers to Showcase, Discover, and Get Inspired.
            </p>

            {/* Main Content */}
            <div className="mt-10 p-8 bg-base-100 shadow-2xl rounded-2xl max-w-4xl mx-auto transition-all duration-300 ease-in-out transform hover:scale-105">
            <p className="text-lg sm:text-xl text-base-content/80 leading-relaxed">
                {"Dev Gallary is a dynamic hub for developers to share their web projects, explore innovative creations by others, and connect with like-minded enthusiasts. Whether you're building passion projects, professional portfolios, or experimental ideas, Dev Gallary is your space to shine."}
            </p>

            {/* Key Features */}
            <div className="mt-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">Key Features</h2>
                <ul className="space-y-4 text-left mx-auto max-w-2xl">
                {[
                    "Showcase your web projects with descriptions and live links",
                    "Explore a wide range of creative and functional web apps",
                    "Search and filter projects by category or tech stack",
                    "Responsive and modern UI using Tailwind and DaisyUI",
                    "User authentication and personalized profiles",
                    "Engage with the developer community through shared inspiration",
                ].map((feature, index) => (
                    <li key={index} className="flex items-center text-lg sm:text-xl text-base-content/80">
                    <IconCheck className="text-primary mr-3" size={24} />
                    {feature}
                    </li>
                ))}
                </ul>
            </div>
            </div>

            {/* Developer Info Section */}
            <div className="mt-12 p-8 bg-base-100 shadow-xl rounded-2xl max-w-4xl mx-auto transition-all duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">Developer Information</h2>
            <p className="text-lg sm:text-xl text-base-content/80 mb-6">
                {"Developed by passionate developers who believe in empowering the community. Feel free to connect or explore more!"}
            </p>
            
            {/* Social and Contact Links */}
            <div className="flex justify-center space-x-8">
                <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer">
                <IconBrandGithub className="text-primary hover:text-primary-focus transition-all duration-300" size={30} />
                </a>
                <a href="https://your-portfolio.com" target="_blank" rel="noopener noreferrer">
                <IconLink className="text-primary hover:text-primary-focus transition-all duration-300" size={30} />
                </a>
                <a href="mailto:developer@example.com" target="_blank" rel="noopener noreferrer">
                <IconMail className="text-primary hover:text-primary-focus transition-all duration-300" size={30} />
                </a>
            </div>
            </div>

            {/* Final Call to Action */}
            <p className="mt-8 text-lg sm:text-xl text-base-content/80">
            {"Whether you're a seasoned developer or just getting started, Dev Gallary provides the perfect space to display your work and discover the potential of the developer community."}
            </p>
        </div>
        </section>
    );
}
