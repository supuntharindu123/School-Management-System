import api from "../../../services/api";

export async function savePromotions(promotions) {
  try {
    const res = await api.post("/promotion", promotions);
    return res.data;
  } catch (error) {
    console.error("Error saving promotions:", error);
    throw error;
  }
}
