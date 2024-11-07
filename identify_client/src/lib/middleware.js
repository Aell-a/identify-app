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

export const editProfile = async (profile) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/users/profile/edit`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status !== 404) {
    return response.data;
  }
};

export const editProfilePicture = async (id, formData) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/media/profile/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to upload profile picture");
  return response.json();
};
