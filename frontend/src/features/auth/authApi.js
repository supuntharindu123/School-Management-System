import api from "../../services/api";

export const Login = async (logindata) => {
  const res = await api.post("/auth/login", logindata);
  return res.data;
};

export const Me = async () => {
  const res = await api.post("/auth/login", logindata);
  return res.data;
};
