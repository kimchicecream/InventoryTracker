import axios from "axios";

const API_URL = "http://127.0.0.1:8000";
const API_KEY = import.meta.env.VITE_API_KEY;

axios.defaults.withCredentials = true;

// Default headers for all request
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common["x-api-key"] = API_KEY;

// POST new image
export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/upload-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.image_url;
}

// POST new part
export async function addPart(part, file) {
    if (file) {
      const imageUrl = await uploadImage(file);
      part.image = imageUrl;
    }
    const response = await axios.post(`${API_URL}/parts`, part);
    return response.data;
}

// GET all parts
export async function fetchParts() {
    const response = await axios.get(`/parts`);
    return response.data;
}

// UPDATE part
export async function updatePart(id, part) {
    const response = await axios.put(`/parts/${id}`, part);
    return response.data;
}

// DELETE part
export async function deletePart(id) {
    const response = await axios.delete(`/parts/${id}`);
    return response.data;
}
