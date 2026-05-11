export interface SmartCup {
    id: number;
    mesa_id: number;
    identificador: string;
    status: "ativo" | "inativo"
    peso_atual: number;
    ultima_comunicacao: string;
}