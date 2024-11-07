"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { editProfile, getProfile, editProfilePicture } from "@/lib/middleware";
import { Button } from "@/components/ui/button";
import ImageCropper from "@/app/components/imageCropper";
import { readAndCompressImage } from "browser-image-resizer";

export default function ProfilePage({ params }) {
  const { id } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const fetchProfile = useCallback(async (id) => {
    try {
      const response = await getProfile(id);
      setProfile(response);
      if (response) {
        setEditedBio(response.bio);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchProfile(params.id);
  }, [params.id, fetchProfile]);

  const timeSinceLastActivity = useCallback((date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes";
    return Math.floor(seconds) + " seconds";
  }, []);

  const handleSaveProfile = useCallback(async () => {
    try {
      const updatedProfile = await editProfile({ ...profile, bio: editedBio });
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  }, [profile, editedBio]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageUpload = useCallback(
    async (imageToUpload) => {
      setIsUploadingImage(true);
      try {
        const config = {
          quality: 0.7,
          maxWidth: 500,
          maxHeight: 500,
          autoRotate: true,
          debug: true,
        };

        const resizedImage = await readAndCompressImage(imageToUpload, config);

        const formData = new FormData();
        formData.append("file", resizedImage, "profile_picture.jpg");

        await editProfilePicture(id, formData);
        await fetchProfile(params.id);
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
      }
      setIsUploadingImage(false);
      setSelectedImage(null);
    },
    [id, params.id, fetchProfile]
  );

  const handleCropComplete = useCallback(
    (croppedImage) => {
      if (croppedImage) {
        handleImageUpload(croppedImage);
      }
      setIsCropping(false);
    },
    [handleImageUpload]
  );

  if (!profile) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="flex justify-between">
          <div className="flex items-center space-x-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              {profile.profilePicture ? (
                <Image
                  src={profile.profilePicture}
                  alt={profile.nickname}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <label
                    htmlFor="profile-picture-upload"
                    className="cursor-pointer text-white text-xs text-center"
                  >
                    Click to add/change profile picture
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.nickname}</h1>
              {isEditing ? (
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded mt-2"
                  rows={3}
                />
              ) : (
                <p className="text-gray-400 mt-2">{profile.bio}</p>
              )}
            </div>
          </div>
          <div>
            {profile.id === id && (
              <div>
                {isEditing ? (
                  <Button onClick={handleSaveProfile}>Save Profile</Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Account Info</h2>
            <p>
              Created: {new Date(profile.accountCreated).toLocaleDateString()}
            </p>
            <p>
              Last activity: {timeSinceLastActivity(profile.lastActivity)} ago
            </p>
            <p>Total upvotes: {profile.totalPoints}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Followed Tags</h2>
            <div className="flex flex-wrap gap-2">
              {profile.followedTags && profile.followedTags.length > 0 ? (
                profile.followedTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-white px-2 py-1 rounded-full text-sm">
                  User is not following any tags
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Badges</h2>
          <div className="flex flex-wrap gap-2">
            {profile.badges && profile.badges.length > 0 ? (
              profile.badges.map((badge) => (
                <span
                  key={badge}
                  className="bg-yellow-600 text-white px-2 py-1 rounded-full text-sm"
                >
                  {badge}
                </span>
              ))
            ) : (
              <span className="text-white px-2 py-1 rounded-full text-sm">
                No badges to display
              </span>
            )}
          </div>
        </div>
      </div>
      {selectedImage && !isCropping && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-white">Preview</h3>
            <img src={selectedImage} alt="Preview" className="max-w-sm mb-4" />
            <div className="flex justify-between space-x-4">
              <Button
                onClick={() => setIsCropping(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Crop Image
              </Button>
              <Button
                onClick={() => handleImageUpload(selectedImage)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Upload Without Cropping
              </Button>
              <Button
                onClick={() => setSelectedImage(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white border border-gray-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {isCropping && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded-lg">
            <ImageCropper
              image={selectedImage}
              onCropComplete={handleCropComplete}
            />
          </div>
        </div>
      )}
      {isUploadingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white">Uploading image...</div>
        </div>
      )}
    </div>
  );
}
