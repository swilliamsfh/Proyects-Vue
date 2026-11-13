import axiosInstance from "@/api/axiosInstance.js";

export const agentService = {
  getAllAgents: async (filtros = {}, headers = {}) => {
    const { data } = await axiosInstance.get('collections/agents', {
      params: filtros,
      headers
    });
    return data;
  }
}