import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getEmpresa } from "../modules/empresa/services/empresaApi.js";

const EmpresaContext = createContext(null);

export const EmpresaProvider = ({ children }) => {
  const [empresa, setEmpresa] = useState(null);
  const [empresaLoading, setEmpresaLoading] = useState(true);
  const [empresaError, setEmpresaError] = useState(null);

  const cargarEmpresa = useCallback(async () => {
    setEmpresaLoading(true);
    setEmpresaError(null);
    try {
      const empresaData = await getEmpresa();
      setEmpresa(empresaData);
      return empresaData;
    } catch (error) {
      setEmpresa(null);
      if (error.status !== 404) {
        setEmpresaError(error);
      }
      return null;
    } finally {
      setEmpresaLoading(false);
    }
  }, []);

  const registrarEmpresa = useCallback((empresaData) => {
    setEmpresa(empresaData);
    setEmpresaError(null);
    setEmpresaLoading(false);
  }, []);

  useEffect(() => {
    cargarEmpresa();
  }, [cargarEmpresa]);

  return (
    <EmpresaContext.Provider
      value={{
        empresa,
        empresaLoading,
        empresaError,
        cargarEmpresa,
        registrarEmpresa,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error("useEmpresa must be used within an EmpresaProvider");
  }
  return context;
};