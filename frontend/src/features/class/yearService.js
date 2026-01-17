import api from "../../services/api";

export async function getYears() {
  const res = await api.get("/Year");
  return res.data;
}
