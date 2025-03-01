import axios from "axios";

const API_URL = "http://127.0.0.1:8000";
const API_KEY = import.meta.env.VITE_API_KEY;

axios.defaults.withCredentials = true;

// Default headers for all request
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common["x-api-key"] = API_KEY;

// GET all parts
export async function fetchParts() {
    const response = await axios.get(`${API_URL}/parts`);
    return response.data;
}

// POST new part
export async function addPart(part, file) {
    let imageUrl = null;

    if (file) {
        imageUrl = await uploadImage(file);
    }

    const response = await axios.post("/parts", { ...part, image: imageUrl });
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

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("/upload-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.image_url;
}
