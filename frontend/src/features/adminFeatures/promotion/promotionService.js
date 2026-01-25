import api from "../../../services/api";

export const promotionStudent = async () => {
  try {
    const res = await api.post("/promotion");
    return res;
  } catch (error) {
    console.log(error);
  }
};
