import api from "./api";

export async function getGradeSummaries() {
  const res = await api.get("/grade/summary");
  return res.data;
}
