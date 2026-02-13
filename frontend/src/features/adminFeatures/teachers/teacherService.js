import api from "../../../services/api";

export const teacherListAPI = async () => {
  try {
    const res = await api.get("/teacher");
    return res.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const getTeacherById = async (id) => {
  try {
    const res = await api.get(`/teacher/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching teacher ${id}:`, error);
    throw error;
  }
};

export const createTeacher = async (dto) => {
  try {
    const res = await api.post("/teacher/add", dto);
    return res.data;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

export const assignClassToTeacher = async (payload) => {
  try {
    const res = await api.post("/teacher/class/assign", payload);
    return res.data;
  } catch (error) {
    console.error("Error assigning class to teacher:", error);
    throw error;
  }
};

export const assignSubjectToTeacher = async (payload) => {
  try {
    const res = await api.post("/teacher/subject/assign", payload);
    return res.data;
  } catch (error) {
    console.error("Error assigning subject to teacher:", error);
    throw error;
  }
};

export const getAllSubjectAssignments = async () => {
  try {
    const res = await api.get("/teacher/subject/assign");
    return res.data;
  } catch (error) {
    console.error("Error fetching all subject assignments:", error);
    throw error;
  }
};

export const terminateSubjectAssignment = async (assignmentId) => {
  try {
    const res = await api.put(`/teacher/subject/assign/${assignmentId}`);
    return res.data;
  } catch (error) {
    console.error(
      `Error terminating subject assignment ${assignmentId}:`,
      error,
    );
    throw error;
  }
};

export const getClassAssignmentsForTeacher = async (teacherId) => {
  try {
    const res = await api.get(`/teacher/class/teacher/${teacherId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching class assignments for teacher:", error);
    throw error;
  }
};

export const getSubjectAssignmentsForTeacher = async (teacherId) => {
  try {
    const res = await api.get(`/teacher/subject/teacher/${teacherId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching subject assignments for teacher:", error);
    throw error;
  }
};

export const terminateClassAssignment = async (assignmentId) => {
  try {
    const res = await api.put(`/teacher/class/assign/${assignmentId}`);
    return res.data;
  } catch (error) {
    console.error("Error terminating class assignment:", error);
    throw error;
  }
};

export const updateTeacher = async (id, payload) => {
  try {
    const body = {
      ...payload,
      BirthDay: payload.BirthDay ? formatDateOnly(payload.BirthDay) : undefined,
    };
    const res = await api.put(`/teacher/${id}`, body);
    return res.data;
  } catch (error) {
    console.error(`Error updating teacher ${id}:`, error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    const res = await api.delete(`/teacher/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting teacher ${id}:`, error);
    throw error;
  }
};

export const getAssignmentsByClassAndSubject = async (classId, subjectId) => {
  try {
    const res = await api.get(`/teacher/subject/${subjectId}/class/${classId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching subject assignments for class and subject:",
      error,
    );
    throw error;
  }
};

function formatDateOnly(value) {
  if (!value) return undefined;
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (!isNaN(d.getTime())) return formatDateOnly(d);
  return value;
}
