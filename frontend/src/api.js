import axios from "axios";

const API_URL = "http://127.0.0.1:8000";
const API_KEY = import.meta.env.VITE_API_KEY;

// Default headers for all request
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common["x-api-key"] = API_KEY;

// GET all parts
export async function fetchParts() {
    const response = await axios.get(`${API_URL}/parts`);
    return response.data;
}

// POST new part
export async function addPart(part) {
    const response = await axios.post(`${API_URL}/parts`, part);
    return response.data;
}

// UPDATE part
export async function updatePart(id, part) {
    const response = await axios.put(`${API_URL}/parts/${id}`, part);
    return response.data;
}

export async function deletePart(id) {
    const response = await axios.delete(`${API_URL}/parts/${id}`);
    return response.data;
}
