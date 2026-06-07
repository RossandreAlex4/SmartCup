import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomButton from "../views/components/customButton";

describe("Componente CustomButton", () => {
  it("deve renderizar o botão com o texto do título", () => {
    const { getByText } = render(<CustomButton title="Salvar" onPress={() => {}} />);
    expect(getByText("Salvar")).toBeTruthy();
  });

  it("deve tratar eventos de clique quando ativo", () => {
    const mockPress = jest.fn();
    const { getByText } = render(<CustomButton title="Salvar" onPress={mockPress} />);
    fireEvent.press(getByText("Salvar"));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it("deve estar desativado e não disparar onPress quando a propriedade disabled for verdadeira", () => {
    const mockPress = jest.fn();
    const { getByText } = render(<CustomButton title="Salvar" onPress={mockPress} disabled={true} />);
    fireEvent.press(getByText("Salvar"));
    expect(mockPress).not.toHaveBeenCalled();
  });
});
