import api from "../../services/api";

export async function getExams() {
  const res = await api.get("/Exam");
  return res.data;
}

export async function createExam(payload) {
  // payload: { title, description, startDate, endDate, academicYearId, gradeId }
  const res = await api.post("/Exam", payload);
  return res.data;
}
