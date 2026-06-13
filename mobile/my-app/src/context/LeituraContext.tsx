import React, { createContext, useReducer, useContext, useRef, ReactNode } from 'react';
import { api } from "../services/api";
import { salvarLeituras, buscarLeiturasLocais } from "../services/localDatabase";

type Leitura = {
  id?: number;
  smartcup_id: number;
  mesa_id: number;
  peso: number;
  porcentagem: number;
  status: string;
};

type LeiturasState = {
  leiturasGlobais: Leitura[];
  offline: boolean;
};

type LeiturasAction =
  | { type: "ATUALIZAR_LEITURAS"; payload: Leitura[] }
  | { type: "SET_OFFLINE"; payload: boolean };

function leiturasReducer(state: LeiturasState, action: LeiturasAction): LeiturasState {
  switch (action.type) {
    case "ATUALIZAR_LEITURAS":
      return { ...state, leiturasGlobais: action.payload, offline: false };
    case "SET_OFFLINE":
      return { ...state, offline: action.payload };
    default:
      return state;
  }
}

type LeiturasContextData = {
  leiturasGlobais: Leitura[];
  offline: boolean;
  buscarLeiturasDaMesa: (mesaId: number) => Promise<void>;
  iniciarMonitoramento: (mesaId: number) => void;
  pararMonitoramento: () => void;
};

const LeiturasContext = createContext<LeiturasContextData>({} as LeiturasContextData);

export const LeiturasProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(leiturasReducer, {
    leiturasGlobais: [],
    offline: false,
  });

  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buscarLeiturasDaMesa = async (mesaId: number) => {
    try {
      const response = await api.get(`/leituras/mesa/${mesaId}`);
      const leituras: Leitura[] = response.data.leituras ?? [];
      dispatch({ type: "ATUALIZAR_LEITURAS", payload: leituras });
      await salvarLeituras(leituras);
    } catch {
      const leiturasLocais = await buscarLeiturasLocais(mesaId);
      dispatch({ type: "ATUALIZAR_LEITURAS", payload: leiturasLocais });
      dispatch({ type: "SET_OFFLINE", payload: true });
    }
  };

  const iniciarMonitoramento = (mesaId: number) => {
    buscarLeiturasDaMesa(mesaId);

    intervaloRef.current = setInterval(() => {
      buscarLeiturasDaMesa(mesaId);
    }, 3000);
  };

  const pararMonitoramento = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  };

  return (
    <LeiturasContext.Provider value={{
      leiturasGlobais: state.leiturasGlobais,
      offline: state.offline,
      buscarLeiturasDaMesa,
      iniciarMonitoramento,
      pararMonitoramento,
    }}>
      {children}
    </LeiturasContext.Provider>
  );
};

export const useLeituras = () => {
  return useContext(LeiturasContext);
};
