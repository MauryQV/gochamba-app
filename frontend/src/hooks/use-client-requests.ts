import { useRegister } from "@/app/register/_register-context";
import { useState, useEffect } from "react";
import { getClientRequests } from "../services/requests.service";
import type { ClientRequest } from "../models/request";

export const useClientRequests = () => {
  const { setupData } = useRegister();
  const [requests, setRequests] = useState<ClientRequest[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = setupData?.token;
      if (!token) {
        throw new Error("No token available");
      }
      const data = await getClientRequests(token);
      setRequests(data);
    } catch (err: any) {
      console.error("Error fetching client requests:", err);
      setError(err?.message || "Error al cargar solicitudes");
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (setupData?.token) {
      fetchRequests();
    }
  }, []);
  //   }, [setupData?.token]);

  return { requests, isLoading, error, refetch: fetchRequests };
};
