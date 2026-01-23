import api from "../../../services/api";

export const GetStudents = async () => {
  const res = await api.get("/student");
  console.log("Fetched students:", res.data);
  return res.data;
};

export const GetStudentById = async (id) => {
  const res = await api.get(`/student/${id}`);
  return res.data;
};

export async function createStudent(payload) {
  // Ensure DateOnly fields are sent as YYYY-MM-DD strings
  const body = {
    ...payload,
    BirthDay: payload.BirthDay ? formatDateOnly(payload.BirthDay) : undefined,
    GuardianDate: payload.GuardianDate
      ? formatDateOnly(payload.GuardianDate)
      : undefined,
  };
  const res = await api.post("/Student/add", body);
  return res.data;
}

export const updateStudent = async (id, payload) => {
  const res = await api.put(`/student/${id}`, payload);
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await api.delete(`/student/${id}`);
  return res.data;
};

function formatDateOnly(value) {
  // Accepts Date object or string from <input type="date">
  if (!value) return undefined;
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // If it's already a YYYY-MM-DD string, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  // Fallback: try to parse
  const d = new Date(value);
  if (!isNaN(d.getTime())) return formatDateOnly(d);
  return value;
}
