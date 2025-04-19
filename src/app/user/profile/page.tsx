"use client";
import { useUser } from "@/context/UserContext";
import { User } from "@/types/user";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";

const Settings = () => {
    const { user } = useUser();
    if (!user) return null;
    return <Profile user={user} />;
};

export default Settings;

const Profile = ({ user }: { user: User }) => {
    const [formData, setFormData] = useState(user || {});
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(formData.profileImage || "/default-profile.png");

    const [profileImage, setprofileImage] = useState();
    // Bio Section
    const [bio, setBio] = useState(user.bio || "");
    const [isBioEdit, setIsBioEdit] = useState(false);
    const [tempBio, setTempBio] = useState("");

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

    // Social Links
    const [socialLinks, setSocialLinks] = useState(
        user.socialLinks || { linkedin: "", github: "", twitter: "", portfolio: "" }
    );

    const handleSocialLinkChange = (field: string, value: string) => {
        setSocialLinks({ ...socialLinks, [field]: value });
    };

    const handleUpdateSocialLinks = () => {
        (document.getElementById("socialLinksDialog") as HTMLDialogElement).close();
    };

    // Image Change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        }
    };

    // Submit Profile Update
    const handleSubmit = async () => {
        if (!formData.name) {
            alert("Please fill in all required fields");
            return;
        }
        const updatedData = { ...formData, bio, socialLinks ,profileImage};
        try {
            await axios.put("/api/user/update", { updatedData });
            toast.success("Profile Updated Successfully");
        } catch (error) {
        toast.error("Something went wrong");
        }
        setIsEditing(false);
    };

    return (
        <>
        {/* Profile Image */}
        <div className="my-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
            <img
                src={imagePreview}
                alt="Profile Pic"
                className="rounded-full h-40 w-40 object-cover border border-primary"
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered"
                disabled={isEditing}
            />
            </div>
        </div>

        {/* Personal Details */}
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
            <hr className="mb-4" />
            <div className="space-y-4 mb-4">
            <div className="flex flex-col">
                <label className="text-base-content font-medium mb-1" htmlFor="fullName">
                Name <span className="text-error">*</span>
                </label>
                <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input input-bordered w-full text-base-content"
                placeholder="Full Name"
                disabled={isEditing}
                required
                />
            </div>
            <div className="flex flex-col">
                <label className="text-base-content font-medium mb-1" htmlFor="email">
                Email
                </label>
                <input
                type="email"
                value={formData.email || ""}
                readOnly
                className="input input-bordered w-full text-base-content"
                placeholder="Email Address"
                disabled
                />
            </div>
            </div>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Bio</h2>
            <hr className="mb-4" />
            <div className="bg-base-200 p-4 rounded-lg shadow-md">
            <div className="flex flex-col space-y-3">
                {isBioEdit ? (
                <textarea
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    className="textarea textarea-bordered w-full text-base-content"
                    placeholder="Tell something about yourself..."
                />
                ) : (
                <p className="text-base-content p-3 bg-base-100 rounded-lg border border-gray-200 shadow-sm">
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
                    <button className="btn btn-primary btn-sm" onClick={handleEditBio}>
                    ✏ Edit
                    </button>
                )}
                </div>
            </div>
            </div>
        </div>

        {/* Social Links Section (Icon Cards) */}
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Social Links</h2>
            <hr className="mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
                { key: "linkedin", icon: <FaLinkedin className="text-blue-600 text-2xl" />, label: "LinkedIn" },
                { key: "github", icon: <FaGithub className="text-gray-800 text-2xl" />, label: "GitHub" },
                { key: "twitter", icon: <FaTwitter className="text-sky-500 text-2xl" />, label: "Twitter" },
                { key: "portfolio", icon: <FaGlobe className="text-green-600 text-2xl" />, label: "Portfolio" },
            ].map(({ key, icon, label }) => (
                <div
                key={key}
                className="flex items-center justify-between bg-base-200 p-4 rounded-xl shadow-md border hover:shadow-lg transition-shadow"
                >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-medium">{label}</span>
                </div>
                <a
                    href={socialLinks[key] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm underline ${
                    socialLinks[key] ? "text-primary" : "text-gray-400 cursor-not-allowed pointer-events-none"
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

        {/* Social Links Dialog */}
        <dialog id="socialLinksDialog" className="modal">
            <div className="modal-box">
            <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg text-center">Edit Social Links</h3>
            <input
                type="url"
                placeholder="LinkedIn URL"
                value={socialLinks.linkedin}
                onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                className="input input-bordered w-full mt-2"
            />
            <input
                type="url"
                placeholder="GitHub URL"
                value={socialLinks.github}
                onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                className="input input-bordered w-full mt-2"
            />
            <input
                type="url"
                placeholder="Twitter URL"
                value={socialLinks.twitter}
                onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                className="input input-bordered w-full mt-2"
            />
            <input
                type="url"
                placeholder="Portfolio URL"
                value={socialLinks.portfolio}
                onChange={(e) => handleSocialLinkChange("portfolio", e.target.value)}
                className="input input-bordered w-full mt-2"
            />
            <button className="btn mt-3 btn-primary w-full" onClick={handleUpdateSocialLinks}>
                Save
            </button>
            </div>
        </dialog>

        {/* Submit Button */}
        <div className="w-full flex items-center justify-center">
            <button
            className="btn btn-primary btn-outline w-5/6 mx-auto"
            onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) handleSubmit();
            }}
            >
            {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
        </div>
        </>
    );
};
