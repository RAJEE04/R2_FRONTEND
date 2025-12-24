import axios from "axios"


const API = axios.create({ baseURL: "http://localhost:5000/api" });
export const getProducts = () => API.get("/products");
export const createProduct = (data: FormData) =>
  API.post("/products", data, { headers: { "Content-Type": "multipart/form-data" }});

export const updateProduct = (id: string, data: FormData) =>
  API.put(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" }});

export const deleteProduct = (id: string) => API.delete(`/products/${id}`);


export default API

