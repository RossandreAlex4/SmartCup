export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    tipo: "admin" | "garcom";
    zona?: string;
    ativo: boolean;
}