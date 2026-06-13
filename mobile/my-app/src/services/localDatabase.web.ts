export function initDatabase(): Promise<void> {
  return Promise.resolve();
}

export async function salvarLeituras(_leituras: any[]) {}

export async function buscarLeiturasLocais(_mesaId: number): Promise<any[]> {
  return [];
}

export async function salvarConfiguracao(_chave: string, _valor: string) {}

export async function buscarConfiguracao(_chave: string): Promise<string | null> {
  return null;
}

export async function salvarMesaCache(_mesaId: number, _dados: any) {}

export async function buscarMesaCache(_mesaId: number): Promise<any | null> {
  return null;
}
