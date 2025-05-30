import axios from "axios";
import { useMemo } from "react";

const useAxios = () => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:3000",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    return instance;
  }, []);

  return axiosInstance;
};

export default useAxios;
