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

export const MarkStudentAttendances = async (attendances) => {
  // attendances: Array<{ isPresent, reason?, date (YYYY-MM-DD), studentId, teacherId }>
  try {
    const res = await api.post(`/studentattendant`, attendances);
    return res.data;
  } catch (error) {
    console.error("Failed to mark attendances:", error);
    throw error;
  }
};

export const GetClassAttendanceByDate = async (classId, date) => {
  try {
    const res = await api.get(`/studentattendant/class/${classId}`, {
      params: { date },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch class attendance by date:", error);
    throw error;
  }
};

export const GetAttendanceByStudent = async (studentId) => {
  try {
    const res = await api.get(`/studentattendant/student/${studentId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch attendance by student:", error);
    throw error;
  }
};

export const UpdateStudentAttendance = async (id, update) => {
  // update: { isPresent: boolean, reason?: string|null, date: YYYY-MM-DD }
  try {
    const res = await api.put(`/studentAttendant/${id}`, update);
    return res.data;
  } catch (error) {
    console.error("Failed to update attendance:", error);
    throw error;
  }
};
