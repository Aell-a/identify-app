import axios from "axios";
require("dotenv").config();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const checkEmail = async (email) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/checkByEmail?email=${email}`
    );
    if (response.status === 409) {
      return false;
    } else if (response.status === 202) {
      return true;
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

export const checkNickname = async (nickname) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/checkByNickname?nickname=${nickname}`
    );
    if (response.status === 409) {
      return false;
    } else if (response.status === 202) {
      return true;
    }
  } catch (error) {
    console.error("Error checking nickname uniqueness:", error);
    return false;
  }
};

export const checkPasswordStrength = (password) => {
  // TODO add password check logic
  return true;
};
