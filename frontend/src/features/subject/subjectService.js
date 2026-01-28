import api from "../../services/api";

export async function getSubjects() {
  const res = await api.get("/subject");
  return res.data;
}

export async function assignSubjectGrades(payload) {
  const res = await api.post("/subject/grade", payload);
  return res.data;
}

export async function addSubject(payload) {
  const res = await api.post("/subject", payload);
  return res.data;
}
``;
