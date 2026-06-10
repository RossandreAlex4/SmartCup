import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

function getBackendHost() {
  if (Platform.OS === "web") {
    return "localhost";
  }
  if (Platform.OS === "android" && !Constants.expoConfig?.developmentClient) {
  }
  const hostUri = Constants.expoConfig?.hostUri || 
  Constants.manifest2?.extra?.expoGo?.packagerOpts?.hostUri ||
  Constants.manifest?.debuggerHost;

  if (hostUri) {
    const [host] = hostUri.split(":");
    return host;
  }
  return "localhost";
}

export const host = getBackendHost();
export const baseURL = `http://${host}:3000`;

console.log("🔌 API Conectada em:", baseURL);

export const api = axios.create({
    baseURL
});

export function setApiToken(token: string | null) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}
