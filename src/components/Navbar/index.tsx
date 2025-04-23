"use client";
import Link from "next/link";
import { FaCode } from "react-icons/fa";
import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import ThemeToggler from "./ThemeToggler";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar px-4 md:px-10 py-3 bg-base-300 sticky top-0 z-50 shadow-lg ">
      {/* Left Logo Section */}
      <div className="navbar-start">
        <Link href="/" className="space-x-3 flex items-center">
          <FaCode size={38} className="text-primary" />
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              DevGallery
            </h1>
            <hr className="w-full border border-base-content" />
            <span className="text-sm text-base-content/70 italic whitespace-nowrap">
              Showcase and Explore Web Projects
            </span>
          </div>
        </Link>
      </div>

      {/* Desktop Center Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-base text-base-content gap-6">
          {/* <li><Link href="/projects">Projects</Link></li> */}
          <li><Link href="/about">About</Link></li>
          <li><Link href="/features">Features</Link></li>
        </ul>
      </div>

      {/* Navbar Right Side */}
      <div className="navbar-end space-x-3 hidden lg:flex">
        <Link href="/login" className="btn btn-sm btn-accent">Login</Link>
        <Link href="/signup" className="btn btn-sm btn-primary">Sign Up</Link>
        <ThemeToggler />
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden navbar-end">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="btn btn-ghost btn-square  text-base-content text-xl"
        >
          {menuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-100 shadow-lg rounded-b-lg flex flex-col items-start gap-3 p-6 lg:hidden z-40 border-t-2 border-base-content/20 transition-all ease-in-out duration-300">
          <Link href="/projects" className="w-full btn btn-ghost justify-start hover:bg-primary/20 text-base-content" onClick={() => setMenuOpen(false)}>
            Projects
          </Link>
          <Link href="/about" className="w-full btn btn-ghost justify-start hover:bg-primary/20 text-base-content" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/features" className="w-full btn btn-ghost justify-start hover:bg-primary/20 text-base-content" onClick={() => setMenuOpen(false)}>
            Features
          </Link>
          <hr className="w-full border-base-content/30" />
          <Link href="/login" className="w-full btn btn-accent btn-sm" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link href="/signup" className="w-full btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
            Sign Up
          </Link>
          <div className="w-full mt-4">
            <ThemeToggler />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
