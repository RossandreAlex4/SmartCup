import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ConfirmLogoutModal from "../views/components/ConfirmLogoutModal";

describe("Componente ConfirmLogoutModal", () => {
  const mockColors = {
    card: "#fff",
    primary: "#00FF00",
    text: "#000",
    secondaryText: "#666",
  };

  it("deve renderizar o título e o texto quando visible for verdadeiro", () => {
    const { getByText } = render(
      <ConfirmLogoutModal
        visible={true}
        colors={mockColors}
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    );
    expect(getByText("Encerrar sessão")).toBeTruthy();
    expect(getByText("Ao voltar, sua sessão será encerrada.")).toBeTruthy();
  });

  it("deve chamar onCancel e onConfirm quando os botões correspondentes forem clicados", () => {
    const mockCancel = jest.fn();
    const mockConfirm = jest.fn();
    const { getByText } = render(
      <ConfirmLogoutModal
        visible={true}
        colors={mockColors}
        onCancel={mockCancel}
        onConfirm={mockConfirm}
      />
    );

    fireEvent.press(getByText("Cancelar"));
    expect(mockCancel).toHaveBeenCalledTimes(1);

    fireEvent.press(getByText("Encerrar"));
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });
});
