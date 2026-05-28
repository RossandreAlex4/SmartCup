import { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"

type ThemeType =
  "dark" | "light";

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

export const ThemeContext =
  createContext({} as ThemeContextType);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [theme, setTheme] =
    useState<ThemeType>("dark");

    useEffect(() => {
    async function carregarTemaSalvo() {
      try {
        const temaSalvo = await AsyncStorage.getItem("@app_theme");
        if (temaSalvo) {
          setTheme(temaSalvo as ThemeType);
        }
      } catch (error) {
        console.error("Erro ao carregar tema:", error);
      }
    }
    carregarTemaSalvo();
  }, []);

  async function toggleTheme() {
    try {
      const novoTema = theme === "dark" ? "light" : "dark";
      setTheme(novoTema);
      await AsyncStorage.setItem("@app_theme", novoTema);
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  }
    
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}