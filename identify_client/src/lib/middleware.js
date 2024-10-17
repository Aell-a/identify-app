import axios from "axios";
require("dotenv").config();

const API_BASE_URL = process.env.API_URL || "";

export const checkEmail = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/check-email`, { email });
    return response.data.isValid;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

export const checkPasswordStrength = async (password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/check-password-strength`,
      { password }
    );
    return response.data.isStrong;
  } catch (error) {
    console.error("Error checking password strength:", error);
    return false;
  }
};

export const checkNicknameUniqueness = async (nickname) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/check-nickname`, {
      nickname,
    });
    return response.data.isUnique;
  } catch (error) {
    console.error("Error checking nickname uniqueness:", error);
    return false;
  }
};

// Add more API call functions as needed
