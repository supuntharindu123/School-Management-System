import api from "../../services/api";

export async function getClassesByGrade(gradeId) {
  if (!gradeId) return [];
  try {
    const res = await api.get(`/class/grade/${gradeId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching classes by grade:", error);
    throw error;
  }
}

export async function getAllClasses() {
  try {
    const res = await api.get("/class");
    return res.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
}

export async function getClassDetails(classId) {
  try {
    const res = await api.get(`/class/${classId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching class details:", error);
    throw error;
  }
}
