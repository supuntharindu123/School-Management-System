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
