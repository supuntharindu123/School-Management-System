import api from "../../services/api";

export async function getMarksByGradeandExam(examId, gradeId) {
  const res = await api.get(`/marks/${examId}/${gradeId}`);
  return res.data;
}

export async function getMarksByStudent(studentId) {
  const res = await api.get(`/marks/${studentId}`);
  return res.data;
}

export async function getMarksByClass(classId) {
  const res = await api.get(`/marks/class/${classId}`);
  return res.data;
}

export async function getMarksByClassAndSubject(classId, subjectId) {
  const res = await api.get(`/marks/class/${classId}/subject/${subjectId}`);
  return res.data;
}

export async function AddMarks(payload) {
  const res = await api.post(`/marks`, payload);
  return res.data;
}
