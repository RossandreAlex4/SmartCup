import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

function getBackendHost() {
  const manifest = Constants.manifest || (Constants as any).expoConfig || {};
  const debuggerHost = (manifest as any).debuggerHost || (manifest as any).packagerOpts?.hostUri;

  if (debuggerHost) {
    const [host] = debuggerHost.split(":");
    return host;
  }

  if (Platform.OS === "android") {
    return "10.0.2.2";
  }

  return "localhost";
}

const baseURL = Platform.OS === "web"
  ? "http://localhost:3000"
  : `http://${getBackendHost()}:3000`;

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