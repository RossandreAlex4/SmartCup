import { createContext, useState, ReactNode } from "react";

type TableType = {
  id: number;
  status: string;
};

type EventData = {
  eventName: string;
  tables: TableType[];
  smartCups: number;
  zones: number;
  waiters: number;
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
      smartCups: 0,
      zones: 0,
      waiters: 0,
    });

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