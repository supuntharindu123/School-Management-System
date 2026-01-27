import api from "./api";

export async function getClassDetails(id) {
  const res = await api.get(`/Class/${id}`);
  return res.data;
}
