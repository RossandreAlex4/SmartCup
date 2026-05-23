import { createContext, useState, ReactNode } from "react";

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

  function toggleTheme() {

    setTheme((prev) =>
      prev === "dark"
        ? "light"
        : "dark"
    );
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