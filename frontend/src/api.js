import axios from "axios";

const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL_DEV;

const API_KEY = import.meta.env.VITE_API_KEY;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common["x-api-key"] = API_KEY;

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`/upload-image`, formData, {
    headers: {
        "Content-Type": "multipart/form-data",
        "x-api-key": API_KEY
    },
  });

  return response.data.image_url;
}

export async function addPart(part, file) {
  if (file) {
    const imageUrl = await uploadImage(file);
    part.image = imageUrl;
  }

  const response = await axios.post(`/parts`, part, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
}

export async function fetchParts() {
  const response = await axios.get(`/parts`);
  return response.data;
}

export async function updatePart(id, part) {
  const response = await axios.put(`/parts/${id}`, part);
  return response.data;
}

export async function deletePart(id) {
  const response = await axios.delete(`/parts/${id}`);
  return response.data;
}
