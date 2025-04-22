import { IconCircleChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-base-300 h-[calc(100vh-4.8rem)] flex items-center">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl text-base-content/80 font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            Dev Gallary  Discover & Showcase Stunning Web Projects
          </h1>
          <p className="max-w-2xl mb-6 font-light text-base-content/70 lg:mb-8 md:text-lg lg:text-xl">
            Explore the creativity of developers, share your own projects, and get inspired by innovative web experiences.
          </p>
          <Link
            href="/projects"
            className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
          >
            Explore Projects
            <IconCircleChevronRight />
          </Link>
          <Link
            href="/signup"
            className="btn btn-outline text-base font-medium text-center rounded-lg"
          >
            Share Your Work
          </Link>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex ">
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
