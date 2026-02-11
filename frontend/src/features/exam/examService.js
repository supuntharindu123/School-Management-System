import api from "../../services/api";

export async function getExams() {
  const res = await api.get("/Exam");
  return res.data;
}

export async function createExam(payload) {
  const res = await api.post("/Exam", payload);
  return res.data;
}

export async function deleteExam(examId) {
  const res = await api.delete(`/exam/${examId}`);
  return res.data;
}

export async function examdetails(examId) {
  const res = await api.get(`/exam/detailed/${examId}`);
  return res.data;
}

export async function assignExamToGrade(grades) {
  const res = await api.post("/exam/assign/grade", grades);
  return res.data;
}

export async function assignExamToSubject(subjects) {
  const res = await api.post("/exam/assign/subject", subjects);
  return res.data;
}
