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
        try {
            const response = axios.post("/api/auth/signup", { formData });
            toast.promise(response, {
                loading: "Creating Account...",
                success: () => {
                    router.push("/login");
                    return "Account Created Successfully";
                },
                error: (err: unknown) => err.response?.data?.message || "Error creating account",
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
        setFormData({ ...formData, profileImage: file.name });
        }
    };

    return (
        <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 min-h-[calc(100vh-5rem)]">
            <div className="xl:max-w-7xl bg-base-100 shadow-lg border border-base-content/20 w-full rounded-xl flex justify-between items-stretch px-5 py-8">
                {/* Left Image */}
                <div className="sm:w-[60%] lg:w-[50%] hidden md:flex items-center justify-center">
                    <img src="/login.png" alt="Signup" className="h-[500px]" />
                </div>

                {/* Signup Form */}
                <div className="mx-auto w-full lg:w-1/2 flex flex-col justify-center p-2 md:p-8">
                    <h1 className="text-center text-3xl font-bold text-primary mb-6">
                        Create Account
                    </h1>

                    <div className="flex flex-col gap-4">
                        <input
                        type="text"
                        placeholder="Full Name"
                        className="input input-bordered input-primary w-full"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input input-bordered input-primary w-full"
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
                        className="file-input file-input-bordered w-full"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        />

                        <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered input-primary w-full"
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
                        className="btn btn-primary btn-block"
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
