import { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TableType = {
  id: number;
  status: string;
};

type EventData = {
  eventName: string;
  tables: TableType[];
  volumeCopo: number;
  zones: number;
  gatilhoAlerta: number;
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
      volumeCopo: 0,
      zones: 0,
      gatilhoAlerta: 0,
    });

    useEffect(() => {
    async function restaurarDadosDoEvento() {
      try {
        const nomeSalvo = await AsyncStorage.getItem("@nome_evento");
        const volumeSalvo = await AsyncStorage.getItem("@volume_copo");
        const gatilhoSalvo = await AsyncStorage.getItem("@gatilho_alerta");
        const zonasSalvas = await AsyncStorage.getItem("@qtd_zonas");
        if (nomeSalvo) {
            setEventData({
              eventName: nomeSalvo,
              tables: [],
              volumeCopo: volumeSalvo ? Number(volumeSalvo) : 0,
              gatilhoAlerta: gatilhoSalvo ? Number(gatilhoSalvo) : 0,
              zones: zonasSalvas ? Number(zonasSalvas) : 0,
            });
          }
        } catch (error) {
          console.error("Erro ao restaurar dados do evento:", error);
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