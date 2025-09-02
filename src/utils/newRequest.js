import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://freelancing-app-nodejs.onrender.com/api",
  withCredentials: true,
});

export default newRequest;
