import api from "../../services/api";

export const AllStudentAttendance = async () => {
  try {
    const res = await api.get(`/studentattendant`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch all student attendance:", error);
    throw error;
  }
};
