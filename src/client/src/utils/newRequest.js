import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

export default newRequest;

// https://freelancing-app-nodejs.onrender.com/api
// http://localhost:8800/api