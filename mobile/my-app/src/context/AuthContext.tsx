import { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, setApiToken } from "../services/api";

export interface User {
  id: number;
  nome: string;
  tipo: "admin" | "garcom";
  email?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginAdmin: (email: string, senha: string) => Promise<void>;
  loginGarcom: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storagedUser = await AsyncStorage.getItem("@SmartCup:user");
        if (storagedUser) {
          const parsedUser = JSON.parse(storagedUser) as User;
          setApiToken(parsedUser.token ?? null);
          if (parsedUser.tipo === "garcom" && parsedUser.token) {
            const response = await api.post("/usuarios/login-token", {
              token: parsedUser.token,
            });
            if (response.data.sucesso) {
              setUser(parsedUser);
            } else {
              setApiToken(null);
              await AsyncStorage.removeItem("@SmartCup:user");
            }
          } else {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        await AsyncStorage.removeItem("@SmartCup:user");
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  async function loginAdmin(email: string, senha: string) {
    const response = await api.post("/usuarios/login", { email, senha });
    if (response.data.sucesso) {
      const userData: User = response.data.usuario;
      setApiToken(userData.token ?? null);
      setUser(userData);
      await AsyncStorage.setItem("@SmartCup:user", JSON.stringify(userData));
    } else {
      throw new Error(response.data.mensagem || "Erro ao fazer login");
    }
  }

  async function loginGarcom(token: string) {
    const response = await api.post("/usuarios/login-token", { token });
    if (response.data.sucesso) {
      const userData: User = response.data.usuario;
      setApiToken(userData.token ?? null);
      setUser(userData);
      await AsyncStorage.setItem("@SmartCup:user", JSON.stringify(userData));
    } else {
      setApiToken(null);
      throw new Error(response.data.mensagem || "Token invalido");
    }
  }

  async function logout() {
    await AsyncStorage.removeItem("@SmartCup:user");
    setApiToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, loginGarcom, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
