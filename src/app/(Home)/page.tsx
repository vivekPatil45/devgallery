import { IconCircleChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-base-300 h-[calc(100vh-4.8rem)] flex items-center px-4">
      <div className="max-w-screen-xl mx-auto lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-0 lg:py-16 py-8 flex flex-col-reverse lg:flex-row items-center">
        
        {/* Left Section */}
        <div className="lg:col-span-7 text-center lg:text-left">
          <h1 className="text-4xl text-base-content/90 font-extrabold tracking-tight leading-tight sm:text-5xl md:text-5xl xl:text-6xl mb-2">
            DevGallary
          </h1>
          <h2 className="text-2xl text-base-content/80 font-semibold sm:text-3xl md:text-3xl lg:text-4xl mb-6">
            Discover & Showcase Stunning Web Projects
          </h2>
          <p className="text-base-content/80 font-light leading-relaxed sm:text-lg md:text-xl lg:text-xl mb-6">
            Explore the creativity of developers, share your own projects, and get inspired by innovative web experiences.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <Link
              href="/signup"
              className="btn btn-primary text-base font-medium text-center rounded-lg"
            >
              Explore Projects
              <IconCircleChevronRight />
            </Link>
            <Link
              href="/signup"
              className="btn btn-secondary font-medium text-center rounded-lg"
            >
              Share Your Work
            </Link>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="lg:col-span-5 hidden lg:block mt-8 lg:mt-0">
          <div className="relative w-full h-[400px]">
            <Image
              src="/bg.png"
              alt="Dev Gallary Showcase"
              fill
              className="rounded-2xl shadow-xl object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
