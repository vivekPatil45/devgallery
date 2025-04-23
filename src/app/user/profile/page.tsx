"use client";
import { useUser } from "@/context/UserContext";
import { User } from "@/types/user";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    FaGithub,
    FaLinkedin,
    FaTwitter,
    FaGlobe,
} from "react-icons/fa";

const Settings = () => {
    const { user } = useUser();
    if (!user) return null;
    return <Profile user={user} />;
};

export default Settings;

const Profile = ({ user }: { user: User }) => {
    
    const [formData, setFormData] = useState(user || {});
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(
        formData.profileImage || "/default-profile.png"
    );
    const [profileImage, setProfileImage] = useState<string | undefined>();

    const [bio, setBio] = useState(user.bio || "");
    const [isBioEdit, setIsBioEdit] = useState(false);
    const [tempBio, setTempBio] = useState("");

    const [socialLinks, setSocialLinks] = useState(
        user.socialLinks || {
        linkedin: "",
        github: "",
        twitter: "",
        portfolio: "",
        }
    );

    const handleEditBio = () => {
        setTempBio(bio);
        setIsBioEdit(true);
    };

    const handleSaveBio = () => {
        setBio(tempBio);
        setIsBioEdit(false);
    };

    const handleCancelBio = () => {
        setIsBioEdit(false);
        setTempBio(bio);
    };

    const handleSocialLinkChange = (field: string, value: string) => {
        setSocialLinks({ ...socialLinks, [field]: value });
    };

    const handleUpdateSocialLinks = () => {
        (document.getElementById("socialLinksDialog") as HTMLDialogElement).close();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files[0]) return;

        const file = files[0];
        if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
        setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const formDataImage = new FormData();
        formDataImage.append("file", file);

        const uploadPromise = axios.post("/api/helper/upload-img", formDataImage);

        toast.promise(uploadPromise, {
        loading: "Uploading Image...",
        success: (res) => {
            const uploadedUrl = res.data.data.url;
            setFormData((prev) => ({ ...prev, profileImage: uploadedUrl }));
            setProfileImage(uploadedUrl);
            return "Image Uploaded Successfully!";
        },
        error: "Failed to upload image.",
        });
    };

    const handleSubmit = async () => {
        if (!formData.name) {
        alert("Please fill in all required fields");
        return;
        }

        const updatedData = { ...formData, bio, socialLinks, profileImage };
        try {
        await axios.put("/api/user/update", { updatedData });
        toast.success("Profile Updated Successfully");
        } catch {
        toast.error("Something went wrong");
        }
        setIsEditing(false);
    };

    const socialKeys = ["linkedin", "github", "twitter", "portfolio"] as const;

    const iconMap = {
        linkedin: <FaLinkedin className="text-info text-2xl" />,
        github: <FaGithub className="text-neutral text-2xl" />,
        twitter: <FaTwitter className="text-sky-500 text-2xl" />,
        portfolio: <FaGlobe className="text-success text-2xl" />,
    };

    const labelMap = {
        linkedin: "LinkedIn",
        github: "GitHub",
        twitter: "Twitter",
        portfolio: "Portfolio",
    };

    return (
        <>
        {/* Profile Image */}
        <div className="my-6 flex items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-center gap-4">
                
                <Image
                    src={imagePreview}
                    alt="Profile Pic"
                    width={160}
                    height={160}
                    className="rounded-full object-cover border-4 border-primary shadow-md"
                    style={{ width: "160px", height: "160px" }}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    disabled={isEditing}
                />
            </div>
        </div>

        {/* Personal Details */}
        <div className="mb-8">
            <h2 className="text-lg font-bold mb-2 text-primary">Personal Details</h2>
            <hr className="mb-4" />
            <div className="space-y-4">
                <div>
                    <label className="label">
                    <span className="label-text font-medium">
                        Name <span className="text-error">*</span>
                    </span>
                    </label>
                    <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input input-bordered w-full"
                        placeholder="Full Name"
                        disabled={isEditing}
                        required
                    />
                </div>

                <div>
                    <label className="label">
                    <span className="label-text font-medium">Email</span>
                    </label>
                    <input
                    type="email"
                    value={formData.email || ""}
                    className="input input-bordered w-full"
                    readOnly
                    disabled
                    />
                </div>
            </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
            <h2 className="text-lg font-bold mb-2 text-primary">Bio</h2>
            <hr className="mb-4" />
            <div className="bg-base-200 p-4 rounded-xl shadow">
            <div className="flex flex-col gap-4">
                {isBioEdit ? (
                <textarea
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    className="textarea textarea-bordered w-full"
                    placeholder="Tell something about yourself..."
                />
                ) : (
                <p className="p-3 bg-base-100 border rounded-lg shadow-sm text-base-content">
                    {bio || <span className="text-gray-500">No bio added yet.</span>}
                </p>
                )}
                <div className="flex gap-2">
                {isBioEdit ? (
                    <>
                    <button className="btn btn-success btn-sm" onClick={handleSaveBio}>
                        💾 Save
                    </button>
                    <button className="btn btn-error btn-sm" onClick={handleCancelBio}>
                        ✖ Cancel
                    </button>
                    </>
                ) : (
                    <button className="btn btn-outline btn-primary btn-sm" onClick={handleEditBio}>
                    ✏ Edit
                    </button>
                )}
                </div>
            </div>
            </div>
        </div>

        {/* Social Links */}
        <div className="mb-10">
            <h2 className="text-lg font-bold mb-2 text-primary">Social Links</h2>
            <hr className="mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialKeys.map((key) => (
                <div
                key={key}
                className="flex items-center justify-between bg-base-200 p-4 rounded-xl shadow border hover:shadow-lg transition-all"
                >
                <div className="flex items-center gap-3">
                    {iconMap[key]}
                    <span className="font-medium">{labelMap[key]}</span>
                </div>
                <a
                    href={socialLinks[key] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`underline text-sm ${
                    socialLinks[key]
                        ? "text-primary hover:text-primary-focus"
                        : "text-gray-400 cursor-not-allowed pointer-events-none"
                    }`}
                >
                    {socialLinks[key] ? "Visit" : "Not Added"}
                </a>
                </div>
            ))}
            </div>
            <div className="mt-4">
            <button
                className="btn btn-outline btn-primary w-full"
                onClick={() =>
                (document.getElementById("socialLinksDialog") as HTMLDialogElement).showModal()
                }
            >
                ✏️ Edit Social Links
            </button>
            </div>
        </div>

            {/* Social Links Modal */}
            <dialog id="socialLinksDialog" className="modal">
                <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg text-center text-primary">Edit Social Links</h3>
                <div className="flex flex-col gap-3 mt-4">
                    <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                    className="input input-bordered w-full"
                    />
                    <input
                    type="url"
                    placeholder="GitHub URL"
                    value={socialLinks.github}
                    onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                    className="input input-bordered w-full"
                    />
                    <input
                    type="url"
                    placeholder="Twitter URL"
                    value={socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                    className="input input-bordered w-full"
                    />
                    <input
                    type="url"
                    placeholder="Portfolio URL"
                    value={socialLinks.portfolio}
                    onChange={(e) => handleSocialLinkChange("portfolio", e.target.value)}
                    className="input input-bordered w-full"
                    />
                </div>
                <button className="btn mt-4 btn-primary w-full" onClick={handleUpdateSocialLinks}>
                    Save
                </button>
                </div>
            </dialog>

        {/* Submit */}
        <div className="w-full flex justify-center mt-8">
            <button
            className="btn btn-primary btn-wide"
            onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) handleSubmit();
            }}
            >
            {isEditing ? "💾 Save Changes" : "✏ Edit Profile"}
            </button>
        </div>
        </>
    );
};
