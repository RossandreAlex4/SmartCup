import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.122.162:3000"
});