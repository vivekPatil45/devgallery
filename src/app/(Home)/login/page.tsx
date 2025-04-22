"use client";
import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const router = useRouter();

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            toast.error("Please fill all the fields");
            return;
        }
        const response = axios.post("/api/auth/login", { formData });
        toast.promise(response, {
            loading: "Signing in...",
            success: (data: AxiosResponse) => {
                router.push(data.data.route);
                return data.data.message;
            },
            error: (err: any) => {
                console.log(err);
                return err.response.data.message;
            },
        });
    };

    return (
        <div className="flex justify-center items-center w-full min-h-[calc(100vh-5rem)] bg-base-200 px-4 py-10">
            <div className="w-full max-w-7xl bg-base-100 shadow-2xl border border-base-content/10 rounded-xl flex flex-col md:flex-row overflow-hidden">

                {/* Left Image Section */}
                <div className="hidden md:flex md:w-1/2 bg-base-100 justify-center items-center p-4">
                    <div className="relative w-full h-[500px]">
                        <Image
                            src="/login.png"
                            alt="Login"
                            fill
                            className="object-contain"
                            sizes="(min-width: 768px) 50vw, 100vw"
                            priority
                        />
                    </div>
                </div>

                {/* Right Login Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary text-center">
                    Welcome Back
                </h1>
                <p className="text-base text-base-content/70 text-center mt-2">
                    Login to continue your journey with <span className="text-secondary font-medium">Dev Gallary</span>
                </p>

                <form
                    className="mt-8 flex flex-col gap-6"
                    onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                    }}
                >
                    <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/60"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/60"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <button
                    type="submit"
                    className="btn btn-primary w-full hover:scale-[1.02] transition-transform duration-200"
                    >
                    Log In
                    </button>
                </form>

                <p className="mt-6 text-center text-base text-base-content">
                    {"Don't have an account?"}{" "}
                    <span
                    onClick={() => router.push("/signup")}
                    className="text-primary font-medium hover:underline cursor-pointer"
                    >
                    Sign up here
                    </span>
                </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
