import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getEmpresa } from "../modules/empresa/services/empresaApi.js";

const EmpresaContext = createContext(null);

export const EmpresaProvider = ({ children }) => {
  const [empresa, setEmpresa] = useState(null);
  const [empresaLoading, setEmpresaLoading] = useState(true);
  const [empresaError, setEmpresaError] = useState(null);
  const controllerRef = useRef(null);

  // Una escritura confirmada invalida cualquier lectura anterior aún en vuelo.
  const confirmarEmpresa = useCallback((empresaData) => {
    controllerRef.current?.abort();
    setEmpresa(empresaData);
    setEmpresaError(null);
    setEmpresaLoading(false);
  }, []);

  const cargarEmpresa = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setEmpresaLoading(true);
    setEmpresaError(null);
    try {
      const empresaData = await getEmpresa({ signal: controller.signal });
      if (controller.signal.aborted) return null;
      setEmpresa(empresaData);
      return empresaData;
    } catch (error) {
      if (controller.signal.aborted) return null;
      if (error.status === 404) {
        setEmpresa(null);
      } else {
        // Conservar la personalización confirmada ante un fallo transitorio.
        setEmpresaError(error);
      }
      return null;
    } finally {
      if (!controller.signal.aborted) setEmpresaLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEmpresa();
    return () => controllerRef.current?.abort();
  }, [cargarEmpresa]);

  return (
    <EmpresaContext.Provider
      value={{
        empresa,
        empresaLoading,
        empresaError,
        cargarEmpresa,
        confirmarEmpresa,
        registrarEmpresa: confirmarEmpresa,
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
