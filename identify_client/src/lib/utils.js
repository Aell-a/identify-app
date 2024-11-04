import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const checkPasswordStrength = (password) => {
  // TODO add password check logic
  return true;
};
