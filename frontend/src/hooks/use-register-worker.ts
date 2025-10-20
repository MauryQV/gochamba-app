import { useState, useEffect } from "react";
import { registerWorker } from "../services/register.service";
import type { RegisterWorker } from "../models/register";
import type { Jobs } from "../models/jobs";

export const useRegisterWorker = (jobs: Jobs[]) => {
  const [success, setSuccess] = useState<boolean>(false);

  const registerNewWorker = async (data: RegisterWorker, token?: string) => {
    if (!token) return;
    const filteredJobs = jobs.filter((job) => data.oficios.includes(job.nombre)).map((job) => String(job.id));
    await registerWorker({ ...data, oficios: filteredJobs }, token);
    setSuccess(true);
  };

  return { success, registerNewWorker };
};
