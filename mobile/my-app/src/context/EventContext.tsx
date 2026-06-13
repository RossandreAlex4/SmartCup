import { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { salvarConfiguracao } from "../services/localDatabase";

type TableType = {
  id: number;
  status: string;
};

type EventData = {
  eventName: string;
  tables: TableType[];
  limiteAtencao: number;
  zones: number;
  limiteCritico: number;
  volumeCopo: number;
  pesoCopioVazio: number;
};

type EventContextType = {
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;
};

export const EventContext =
  createContext({} as EventContextType);

export function EventProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [eventData, setEventData] =
    useState<EventData>({
      eventName: "",
      tables: [],
      limiteAtencao: 60,
      zones: 0,
      limiteCritico: 30,
      volumeCopo: 300,
      pesoCopioVazio: 139,
    });

  useEffect(() => {
    async function restaurarDadosDoEvento() {
      try {
        const nomeSalvo =
          await AsyncStorage.getItem("@nome_evento");

        const limiteAtencaoSalvo = await AsyncStorage.getItem("@limite_atencao");
        const limiteCriticoSalvo = await AsyncStorage.getItem("@limite_critico");
        const zonasSalvas = await AsyncStorage.getItem("@qtd_zonas");
        const volumeCopoSalvo = await AsyncStorage.getItem("@volume_copo");
        const pesoCopioVazioSalvo = await AsyncStorage.getItem("@peso_copo_vazio");

        if (nomeSalvo) {
          setEventData({
            eventName: nomeSalvo,
            tables: [],
            limiteAtencao: limiteAtencaoSalvo ? Number(limiteAtencaoSalvo) : 60,
            limiteCritico: limiteCriticoSalvo ? Number(limiteCriticoSalvo) : 30,
            zones: zonasSalvas ? Number(zonasSalvas) : 0,
            volumeCopo: volumeCopoSalvo ? Number(volumeCopoSalvo) : 300,
            pesoCopioVazio: pesoCopioVazioSalvo ? Number(pesoCopioVazioSalvo) : 139,
          });

          await Promise.allSettled([
            salvarConfiguracao("@nome_evento", nomeSalvo),
            salvarConfiguracao("@limite_atencao", limiteAtencaoSalvo ?? "60"),
            salvarConfiguracao("@limite_critico", limiteCriticoSalvo ?? "30"),
            salvarConfiguracao("@qtd_zonas", zonasSalvas ?? "0"),
            salvarConfiguracao("@volume_copo", volumeCopoSalvo ?? "300"),
            salvarConfiguracao("@peso_copo_vazio", pesoCopioVazioSalvo ?? "139"),
          ]);
        }
      } catch (error) {
        console.error(
          "Erro ao restaurar dados do evento:",
          error
        );
      }
    }

    restaurarDadosDoEvento();
  }, []);

  return (
    <EventContext.Provider
      value={{
        eventData,
        setEventData,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}