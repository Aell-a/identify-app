"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { editProfile, getProfile } from "@/lib/middleware";
import { Button } from "@/components/ui/button";

export default function ProfilePage({ params }) {
  const { user, id } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [editedProfilePicture, setEditedProfilePicture] = useState("");

  async function fetchData(id) {
    try {
      const response = await getProfile(id);
      setProfile({
        id: response.id,
        nickname: response.nickname,
        email: response.email,
        profilePicture: response.profilePicture,
        bio: response.bio,
        accountCreated: response.accountCreated,
        lastActivity: response.lastActivity,
        totalPoints: response.totalPoints,
        upvote: response.upvote,
        downvote: response.downvote,
        followedTags: response.followedTags,
        badges: response.badges,
      });
      if (profile) {
        setEditedBio(profile.bio);
        setEditedProfilePicture(profile.profilePicture);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData(params.id);
  }, [params.id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const timeSinceLastActivity = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
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
  };

  const handleSaveProfile = async () => {
    try {
      profile.bio = editedBio;
      profile.profilePicture = editedProfilePicture;
      const token = localStorage.getItem("token");
      const updatedProfile = await editProfile(profile, token);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="flex justify-between">
          <div className="flex items-center space-x-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              {isEditing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <input
                    type="text"
                    value={editedProfilePicture}
                    onChange={(e) => setEditedProfilePicture(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white text-sm"
                    placeholder="Enter image URL"
                  />
                </div>
              ) : null}
              <Image
                src={isEditing ? editedProfilePicture : profile.profilePicture}
                alt={profile.nickname}
                layout="fill"
                objectFit="cover"
              />
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
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedBio(profile.bio);
                      setEditedProfilePicture(profile.profilePicture);
                    }}
                  >
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
              Last activity:{" "}
              {timeSinceLastActivity(new Date(profile.lastActivity))} ago
            </p>
            <p>Total upvotes: {profile.totalPoints}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Followed Tags</h2>
            <div className="flex flex-wrap gap-2">
              {profile.tags && profile.badges.tags > 0 ? (
                profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className=" text-white px-2 py-1 rounded-full text-sm">
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
              <span className=" text-white px-2 py-1 rounded-full text-sm">
                No badges to display
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
