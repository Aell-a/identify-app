import axios from "axios";
require("dotenv").config();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL: `${API_BASE_URL}`,
});

const handleApiResponse = async (apiCall) => {
  try {
    const response = await apiCall();
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error.response.data.error
        ? error.response.data.error
        : error.message,
      status: error.status,
    };
  }
};

export const checkEmail = async (email) => {
  const result = await handleApiResponse(() =>
    api.get(`/users/checkByEmail`, { params: { email } })
  );
  return result.status === 202;
};

export const checkNickname = async (nickname) => {
  const result = await handleApiResponse(() =>
    api.get(`/users/checkByNickname`, { params: { nickname } })
  );
  return result.status === 202;
};

export const register = async (nickname, email, password) => {
  return await handleApiResponse(() =>
    api.post(`/users/register`, { nickname, email, password })
  );
};

export const login = async (identifier, password) => {
  return await handleApiResponse(() =>
    api.post(`/users/login`, { identifier, password })
  );
};

export const verify = async (token) => {
  return await handleApiResponse(() =>
    api.get(`/users/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

export const getProfile = async (id) => {
  const response = await api.get(`/users/profile/${id}`);
  if (response.status !== 404) {
    return response.data;
  }
};

export const editProfile = async (profile, profilePicture = null, token) => {
  return await handleApiResponse(async () => {
    const formData = new FormData();

    formData.append(
      "profile",
      JSON.stringify({
        id: profile.id,
        nickname: profile.nickname,
        bio: profile.bio,
        followedTags: profile.followedTags || [],
        badges: profile.badges || [],
        totalPoints: profile.totalPoints,
        accountCreated: profile.accountCreated,
        lastActivity: profile.lastActivity,
        profilePicture: profile.profilePicture,
      })
    );

    if (profilePicture) {
      formData.append("profilePicture", profilePicture, "profile-image.jpg");
    }
    return await api.put("/users/profile/edit", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  });
};

export const getMainPagePosts = async (page, size = 5) => {
  return await handleApiResponse(() =>
    api.get(`/posts/main`, {
      params: { page, size },
    })
  );
};

export const getUserPosts = async (userId) => {
  return await handleApiResponse(() => api.get(`/posts/user/${userId}`));
};

export const getPostsByTag = async (tagId) => {
  return await handleApiResponse(() => api.get(`/posts/tag/${tagId}`));
};

export const getPost = async (postId) => {
  return await handleApiResponse(() => api.get(`/posts/${postId}`));
};

export const createPost = async (postData) => {
  return await handleApiResponse(() => api.post(`/posts/create`, postData));
};
