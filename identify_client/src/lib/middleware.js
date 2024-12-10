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
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      status: error.response?.status,
    };
  }
};

export const checkEmail = async (email) => {
  return await handleApiResponse(() =>
    api.get(`/users/checkByEmail`, { params: { email } })
  );
};

export const checkNickname = async (nickname) => {
  return await handleApiResponse(() =>
    api.get(`/users/checkByNickname`, { params: { nickname } })
  );
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
  if (!token) {
    return { success: false, error: "No token provided" };
  }

  return await handleApiResponse(() =>
    api.get(`/users/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

export const getProfile = async (id) => {
  return await handleApiResponse(() => api.get(`/users/profile/${id}`));
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

export const createPost = async (formData, token) => {
  return await handleApiResponse(async () => {
    const form = new FormData();

    formData.mediaRequests.forEach((mediaRequest) => {
      form.append("files", mediaRequest.file);
    });

    const postRequest = {
      ...formData,
      mediaRequests: [],
    };

    form.append("postRequest", JSON.stringify(postRequest));

    return await api.post("/posts/create", form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });
};

export const addComment = async (newComment, postId, token) => {
  return await handleApiResponse(() =>
    api.post(`/posts/comment/${postId}`, newComment, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
  );
};
