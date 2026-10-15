
import axios from "axios";

const axiosInstance = axios.create({
  //local instance of fire base instance
  baseURL: "http://localhost:5001/amazon-clone2026/us-central1/api",
  //deployed instance of fire base functions
  baseURL: "https://amazon-api-deploy-lge2.onrender.com/",
});

export { axiosInstance };

