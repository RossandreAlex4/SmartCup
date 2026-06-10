import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from "../services/api";

type Leitura = {
  id?: number;
  smartcup_id: number;
  mesa_id: number;
  peso: number;
  porcentagem: number;
  status: string;
};

type LeiturasContextData = {
  leiturasGlobais: Leitura[];
  buscarLeiturasDaMesa: (mesaId: number) => Promise<void>;
  iniciarMonitoramento: (mesaId: number) => void;
  pararMonitoramento: () => void;
};

const LeiturasContext = createContext<LeiturasContextData>({} as LeiturasContextData);

export const LeiturasProvider = ({ children }: { children: ReactNode }) => {
  const [leiturasGlobais, setLeiturasGlobais] = useState<Leitura[]>([]);
  const [intervaloAtivo, setIntervaloAtivo] = useState<ReturnType<typeof setInterval> | null>(null)

  const buscarLeiturasDaMesa = async (mesaId: number) => {
    try {
      const response = await api.get(`/leituras/mesa/${mesaId}`);
      setLeiturasGlobais(response.data.leituras);
      console.log(`📡 Dados atualizados para a mesa ${mesaId}`);
    } catch (error) {
      console.error("Erro ao buscar leituras no Contexto:", error);
    }
  };

  const iniciarMonitoramento = (mesaId: number) => {
    buscarLeiturasDaMesa(mesaId); 

    const idIntervalo = setInterval(() => {
      buscarLeiturasDaMesa(mesaId);
    }, 3000);

    setIntervaloAtivo(idIntervalo);
  };

  const pararMonitoramento = () => {
    if (intervaloAtivo) {
      clearInterval(intervaloAtivo);
      setIntervaloAtivo(null);
    }
  };

  return (
    <LeiturasContext.Provider value={{ 
      leiturasGlobais, 
      buscarLeiturasDaMesa, 
      iniciarMonitoramento, 
      pararMonitoramento 
    }}>
      {children}
    </LeiturasContext.Provider>
  );
};

export const useLeituras = () => {
  return useContext(LeiturasContext);
};