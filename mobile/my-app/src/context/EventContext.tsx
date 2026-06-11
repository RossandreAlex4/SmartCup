import { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    });

  useEffect(() => {
    async function restaurarDadosDoEvento() {
      try {
        const nomeSalvo =
          await AsyncStorage.getItem("@nome_evento");

        const limiteAtencaoSalvo =
          await AsyncStorage.getItem("@limite_atencao");

        const limiteCriticoSalvo =
          await AsyncStorage.getItem("@limite_critico");

        const zonasSalvas =
          await AsyncStorage.getItem("@qtd_zonas");

        if (nomeSalvo) {
          setEventData({
            eventName: nomeSalvo,
            tables: [],
            limiteAtencao: limiteAtencaoSalvo
              ? Number(limiteAtencaoSalvo)
              : 60,

            limiteCritico: limiteCriticoSalvo
              ? Number(limiteCriticoSalvo)
              : 30,

            zones: zonasSalvas
              ? Number(zonasSalvas)
              : 0,
          });
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