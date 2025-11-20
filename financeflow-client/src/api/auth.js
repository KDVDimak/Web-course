// src/api/auth.js
import api from "./api";

export const registerUser = async (email, password, confirmPassword) => {
  const res = await api.post("/auth/register", {
    email,
    password,
    confirmPassword,
  });

  localStorage.setItem(
    "user",
    JSON.stringify({
      id: res.data.user.id,
      email: res.data.user.email,
      role: res.data.user.role || "user",
    })
  );

  return res;
};

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", res.data.token);

  localStorage.setItem(
    "user",
    JSON.stringify({
      id: res.data.user.id,
      email: res.data.user.email,
      role: res.data.user.role || "user",
    })
  );

  return res;
};
