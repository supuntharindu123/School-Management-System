import api from "../../services/api";

export async function getGrades() {
  const res = await api.get("/grade");
  return res.data;
}
