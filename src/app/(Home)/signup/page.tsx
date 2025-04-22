"use client";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profileImage: "",
        otp: "",
    });

    const [otp, setOtp] = useState(""); // Simulated OTP
    const [disabled, setDisabled] = useState(true);
    const [emailVerified, setEmailVerified] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        const { name, email, password, profileImage } = formData;

        if (!name || !email || !password || !profileImage) {
            toast.error("Please fill all the fields");
            return;
        }
        formData.profileImage = "https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png";
        try {
            const response = axios.post("/api/auth/signup", { formData });
            toast.promise(response, {
                loading: "Creating Account...",
                success: () => {
                    router.push("/login");
                    return "Account Created Successfully";
                },
                error: (err: any) => err.response?.data?.message || "Error creating account",
            });
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("Failed to create account")
        }
    };

    const verifyEmail = async () => {
        if (
            !formData.email ||
            !formData.email.includes("@") ||
            !formData.email.includes(".")
        ) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!formData.name) {
            toast.error("Please enter your name first");
            return;
        }
        try {
            const response = axios.post("/api/helper/verify-email", {
                name: formData.name,
                email: formData.email,
            });
            toast.promise(response, {
                loading: "Sending Email...",
                success: (data: AxiosResponse) => {
                    (
                        document.getElementById("otpContainer") as HTMLDialogElement
                    ).showModal();
                    setOtp(data.data.token);
                    return "Email Sent!!";
                },
                error: (err) => err.data?.response.message || "Something went wrong",
            });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!!");
        }

        // Simulating OTP send
        const generatedOtp = "123456";
        setOtp(generatedOtp);

        (
        document.getElementById("otpContainer") as HTMLDialogElement
        )?.showModal();
        toast.success("OTP sent to your email!");
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size exceeds 5MB");
                return;
            }
            const imageResponse = axios.postForm("/api/helper/upload-img", { file });
            toast.promise(imageResponse, {
                loading: "Uploading Image...",
                success: (data: AxiosResponse) => {
                    setFormData({
                        ...formData,
                        profileImage: data.data.data.url,
                    });
                    return "Image Uploaded Successfully";
                },
                error: (err: unknown) => `This just happened: ${err}`,
            });
        }
    };

    return (
        <div className="flex justify-center items-center w-full bg-base-200 px-4 py-10 min-h-[calc(100vh-5rem)]">
            <div className="xl:max-w-7xl bg-base-100 shadow-2xl border border-base-content/10 w-full rounded-xl flex justify-between items-stretch px-5 py-8">
                {/* Left Image */}
                <div className="sm:w-[60%] lg:w-[50%] hidden md:flex items-center justify-center">
                    <img src="/login.png" alt="Signup" className="h-[500px]" />
                </div>

                {/* Signup Form */}
                <div className="mx-auto w-full lg:w-1/2 flex flex-col justify-center p-2 md:p-8">
                    <h1 className="text-center text-3xl font-semibold text-primary mb-4">
                        Create Account
                    </h1>

                    <div className="flex flex-col gap-4 text-base text-base-content">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/60 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/60 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <button
                            className="btn btn-outline btn-primary"
                            onClick={verifyEmail}
                            disabled={
                            emailVerified ||
                            !formData.email.includes("@") ||
                            !formData.email.includes(".")
                            }
                        >
                            {emailVerified ? "Verified" : "Verify Email"}
                        </button>
                        </div>

                        <input
                            type="file"
                            className="file-input file-input-bordered w-full text-base-content placeholder:text-base-content/60 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/60 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            onChange={() => setDisabled(!disabled)}
                        />
                        <span className="text-base-content">
                            I agree to the{" "}
                            <span className="text-primary underline">Terms</span> and{" "}
                            <span className="text-primary underline">Privacy Policy</span>
                        </span>
                        </label>

                        <button
                        className="btn btn-primary w-full py-3 mt-4 hover:scale-105 transition-transform duration-300 shadow-md"
                        onClick={handleSubmit}
                        disabled={disabled || !emailVerified}
                        >
                            Sign Up
                        </button>

                        <p className="text-center text-base mt-3">
                        Already have an account?{" "}
                        <span
                            className="text-primary font-medium cursor-pointer"
                            onClick={() => router.push("/login")}
                        >
                            Login
                        </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            <dialog id="otpContainer" className="modal">
                <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg text-center mb-3">Enter OTP</h3>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="input input-bordered input-primary w-full"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />
                <button
                    className="btn btn-primary w-full mt-4"
                    onClick={() => {
                    if (otp === formData.otp) {
                        setEmailVerified(true);
                        toast.success("OTP Verified");
                        (
                        document.getElementById("otpContainer") as HTMLDialogElement
                        )?.close();
                    } else {
                        toast.error("Invalid OTP");
                    }
                    }}
                >
                    Verify
                </button>
                </div>
            </dialog>
        </div>
    );
};

export default Signup;
