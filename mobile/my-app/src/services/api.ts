import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

const IP_BACKEND = "192.168.1.34";

function getBackendHost() {
  if (Platform.OS === "web") {
    return "localhost";
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.packagerOpts?.hostUri;

  if (hostUri) {
    const [host] = hostUri.split(":");
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return host;
    }
  }

  return IP_BACKEND;
}

export const host = getBackendHost();
export const baseURL = `http://${host}:3000`;

console.log("🔌 API Conectada em:", baseURL);


export const api = axios.create({
    baseURL,
    timeout: 5000,
});

export function setApiToken(token: string | null) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}
