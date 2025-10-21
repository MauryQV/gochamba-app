import React, { createContext, useContext, useState } from "react";

export type setupData = {
  userId: string | null;
  nombreCompleto: string | null;
  direccion: string | null;
  departamento: string | null;
  telefono: string | null;
  password: string | null;
  confirmPassword: string | null;
  fotoUrl: string | null;
  email: string | null;
  tiene_whatsapp: boolean;
  googleId: string | null;
  token: string | null;
  rol: string[];
};
type RegisterContextType = {
  setupData: any;
  setSetupData: (data: any) => void;
};

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [setupData, setSetupData] = useState<setupData | null>(null);
  return <RegisterContext.Provider value={{ setupData, setSetupData }}>{children}</RegisterContext.Provider>;
}

export function useRegister() {
  const context = useContext(RegisterContext);
  if (!context) throw new Error("useRegister must be used within RegisterProvider");
  return context;
}
