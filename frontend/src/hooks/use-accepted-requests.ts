import { useRegister } from "@/app/register/_register-context";
import { useState, useEffect, useCallback, useRef } from "react";
import { getAcceptedRequests } from "../services/accepted-requests.service";
import type { AcceptedRequest } from "../models/accepted-request";

export const useAcceptedRequests = () => {
  const { setupData } = useRegister();
  const [requests, setRequests] = useState<AcceptedRequest[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = setupData?.token;
      if (!token) {
        throw new Error("No token available");
      }
      const data = await getAcceptedRequests(token);
      setRequests(data);
    } catch (err: any) {
      console.error("Error fetching accepted requests:", err);
      setError(err?.message || "Error al cargar solicitudes");
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [setupData?.token]);

  useEffect(() => {
    if (setupData?.token && !hasFetched.current) {
      hasFetched.current = true;
      fetchRequests();
    }
  }, [setupData?.token, fetchRequests]);

  return { requests, isLoading, error, refetch: fetchRequests };
};
