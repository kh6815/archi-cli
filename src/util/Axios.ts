import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    //임시
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImNvbXBhbnlJZCI6NCwiY29tcGFueU5hbWUiOiLqsJzrsJzshJzrsoTthYzsiqTtirjtmozsgqwiLCJleHAiOjMzNzc3NjQ3MTd9.03yPnbwRJ4bhdPJO1KCeIjCw4LJt9N6a5T49smQXRiA";
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.defaults.withCredentials = true;

export { axios as axiosClient };
