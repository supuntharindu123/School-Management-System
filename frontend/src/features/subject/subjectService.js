import api from "../../services/api";

export async function getSubjects() {
  const res = await api.get("/subject");
  return res.data;
}
