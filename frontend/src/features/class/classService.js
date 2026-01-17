import api from "../../services/api";

export async function getClassesByGrade(gradeId) {
  if (!gradeId) return [];
  const res = await api.get(`/class/grade/${gradeId}`);
  return res.data;
}
