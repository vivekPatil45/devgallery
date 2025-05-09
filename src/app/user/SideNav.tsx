"use client";
import ThemeToggler from "@/components/Navbar/ThemeToggler"
import { SideNavItem } from "@/types/types";
import { SIDENAV_ITEMS } from "./constant";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
    IconChevronDown,
    IconChevronRight,
    IconMenu,
} from "@tabler/icons-react";
import { useUser } from "@/context/UserContext";
import { FaCode, FaSignOutAlt, FaUser } from "react-icons/fa";

const SideNav = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { user } = useUser();
    const handleLogout = async () => {
        await axios.get("/api/auth/logout");
        router.push("/");
    };
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);
    if (!user) return null;
    return (
        <>
            <div className="drawer lg:drawer-open max-h-screen">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                <div className="navbar justify-between bg-base-300 w-full pl-10">
                    <div className="lg:flex items-center justify-end space-x-2 hidden text-base-content">
                    <span className="text-base font-semibold">Home</span>
                    {pathSegments.map((segment, index) => (
                        <React.Fragment key={index}>
                        <span className="text-sm">
                            <IconChevronRight />
                        </span>
                        <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                            <span className="text-base capitalize hover:text-primary transition">
                            { /^[a-f\d]{24}$/i.test(segment)?'dev':segment.replace(/-/g, " ")}
                            {/* {segment.replace(/-/g, " ")} */}
                            </span>
                        </Link>
                        </React.Fragment>
                    ))}
                    </div>
                    
                    <div className="flex-none lg:hidden">
                        <label
                            htmlFor="my-drawer-3"
                            aria-label="open sidebar"
                            className="btn btn-square btn-ghost"
                        >
                            <IconMenu className="h-6 w-6 text-base-content" />
                        </label>
                    </div>

                    <div className="flex justify-between space-x-2  lg:hidden px-2">
                        <h1 className="text-xl font-bold flex items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            <span className="h-7 w-7 font-bold flex items-center justify-center rounded">
                                <FaCode size={30} className="text-primary" />
                            </span>
                            DevGallery
                        </h1>

                        <ThemeToggler />
                    </div>

                    <div className="hidden lg:block">
                        <ul className="menu menu-horizontal flex items-center space-x-4">
                            <ThemeToggler />
                            <div className="dropdown dropdown-left cursor-pointer bg-transparent">
                                <Image
                                    src={user.profileImage!}
                                    alt="Avatar"
                                    className="rounded-full"
                                    width={40}
                                    height={40}
                                    tabIndex={0}
                                    role="button"
                                />
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-50 p-2 shadow text-base text-base-content"
                                >
                                    {/* User Initial */}
                                    {/* 
                                    <div className="flex items-center justify-center mb-2">
                                    <div className="flex items-center justify-center w-12 h-12 bg-primary text-base-conten rounded-full text-xl font-bold">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <span className="text-lg font-semibold text-base-content">
                                            {user.name}
                                        </span>
                                    </div>
                                    <hr className="my-2 border-base-content" />
                                    <div className="flex flex-col">
                                    <Link
                                        className="text-left px-4 py-2 text-base-content hover:bg-base-200 transition duration-200"
                                        href={`/user/profile`}
                                    >
                                        My Account
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-left px-4 py-2 text-base-content text-dark hover:bg-base-200 transition duration-200"
                                    >
                                        Logout
                                    </button>
                                    </div>
                                    */}

                                    <li >
                                        <Link className="flex items-center gap-3" title="View profile" href="/user/profile">
                                            <div className="flex flex-col">
                                                <h3 className="font-bold text-base-content">{user.name}</h3>
                                                <span className="text-xs text-accent">{user.email || 'your@email.com'}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <div className="divider my-1"></div>
                                    <li>
                                        <Link href={`/user/profile`} className="text-base-content/80">
                                            <FaUser className="text-base-content/80"/>
                                            My Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout}>
                                            <FaSignOutAlt className="fa-solid fa-right-from-bracket fa-fw text-error" />
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </ul>
                    </div>
                </div>
                <div>
                    {" "}
                    <main className="overflow-y-auto h-[calc(100vh-5rem)] bg-base-100 p-10 text-base-content">
                    {children}
                    </main>
                </div>
                </div>
                <div className="drawer-side">
                <label
                    htmlFor="my-drawer-3"
                    className="drawer-overlay"
                    aria-label="close sidebar"
                ></label>
                <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <Link
                    href="/user/dashboard"
                    className="flex h-16 w-full flex-row items-center justify-center space-x-3 border-b border-base-content md:justify-start md:px-6"
                    >
                        <h1 className="text-xl font-bold flex items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            <span className="h-7 w-7 font-bold flex items-center justify-center rounded">
                                <FaCode size={30} className="text-primary" />
                            </span>
                            DevGallery
                        </h1>
                    </Link>
                    <div className="flex flex-col space-y-2 mt-10 md:px-6">
                    {SIDENAV_ITEMS.map((item, idx) => (
                        <MenuItem key={idx} item={item} />
                    ))}
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    const baseClasses =
        "flex w-full flex-row items-center justify-between rounded-lg p-2 hover:bg-accent";
    const activeClasses = "bg-base-300 text-base-content";
    const inactiveClasses =
        "text-base-content hover:text-base-content hover:bg-base-100";

    return (
        <div>
        {item.submenu ? (
            <>
            <button
                onClick={toggleSubMenu}
                className={`${baseClasses} ${
                pathname.includes(item.path) ? activeClasses : inactiveClasses
                }`}
            >
                <div className="flex flex-row items-center space-x-4 text-base-content">
                {item.icon}
                <span className="text-lg font-medium">{item.title}</span>
                </div>

                <div
                className={`transition-transform ${
                    subMenuOpen ? "rotate-180" : ""
                } flex`}
                >
                <IconChevronDown width="24" height="24" />
                </div>
            </button>

            {subMenuOpen && (
                <div className="my-2 ml-4 flex flex-col space-y-4">
                {item.subMenuItems?.map((subItem, idx) => (
                    <Link
                    key={idx}
                    href={subItem.path}
                    className={`block rounded-lg p-2 text-base ${
                        subItem.path === pathname
                        ? "font-semibold text-base-content"
                        : "text-base-content/2"
                    } hover:bg-accent`}
                    >
                    <span>{subItem.title}</span>
                    </Link>
                ))}
                </div>
            )}
            </>
        ) : (
            <Link
            href={item.path}
            className={`flex flex-row items-center space-x-4 rounded-lg text-base-content/80 p-2 ${
                item.path === pathname ? activeClasses : inactiveClasses
            }`}
            >
            {item.icon}
            <span className="text-lg font-medium">{item.title}</span>
            </Link>
        )}
        </div>
    );
};
