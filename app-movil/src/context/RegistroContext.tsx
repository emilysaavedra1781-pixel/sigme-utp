
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

export type RegistroData = {
  codigo: string;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  modelo: string;
  placa: string;
  password: string;
  confirmarPassword: string;

  correo: string;
  nacimiento: string;
  licencia: string;
  vencimiento: string;
  conadis: string;
};

const initialData: RegistroData = {
  codigo: "",
  dni: "",
  nombres: "",
  apellidos: "",
  telefono: "",
  modelo: "",
  placa: "",
  password: "",
  confirmarPassword: "",

  correo: "",
  nacimiento: "",
  licencia: "",
  vencimiento: "",
  conadis: "",
};

type RegistroContextType = {
  data: RegistroData;
  updateField: (key: keyof RegistroData, value: string) => void;
  resetRegistro: () => void;
};

const RegistroContext =
  createContext<RegistroContextType | null>(null);

export function RegistroProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState<RegistroData>(initialData);

  const updateField = (
    key: keyof RegistroData,
    value: string
  ) => {
    setData((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetRegistro = () => {
    setData(initialData);
  };

  return (
    <RegistroContext.Provider
      value={{ data, updateField, resetRegistro }}
    >
      {children}
    </RegistroContext.Provider>
  );
}

export function useRegistro() {
  const context = useContext(RegistroContext);

  if (!context) {
    throw new Error(
      "useRegistro debe utilizarse dentro de RegistroProvider"
    );
  }

  return context;
}