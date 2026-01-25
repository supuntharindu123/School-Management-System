import api from "./api";

export async function getAcademicYears() {
  const res = await api.get("/year");
  return res.data;
}

export async function getGrades() {
  const res = await api.get("/grade");
  return res.data;
}

export async function getClassesByGrade(gradeId) {
  const res = await api.get(`/class/grade/${gradeId}`);
  return res.data;
}

export async function getAllStudents() {
  const res = await api.get("/student");
  return res.data;
}
