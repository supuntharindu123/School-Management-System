export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
};

export const setUser = (user) => {
  localStorage.setItem("authUser", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem("authUser");
};
