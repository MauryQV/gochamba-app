import { useState, useEffect } from "react";
import { getJobs } from "../services/jobs.service";
import type { Jobs } from "../models/jobs";
export const useJobs = () => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [jobString, setJobString] = useState<string[]>([]);
  useEffect(() => {
    const fetchJobs = async () => {
      const jobs: Jobs[] = await getJobs();
      setJobs(jobs);
      const jobsConverted = jobs.map((item) => item.nombre);
      setJobString(jobsConverted);
    };
    fetchJobs();
  }, []);

  return { jobs, jobString };
};
