import { useRegister } from "@/app/register/_register-context";
import { useState, useEffect, useCallback, useRef } from "react";
import { getWorkerReviews } from "../services/review.service";
import type { Review } from "../models/review";

export const useWorkerReviews = (userId: string) => {
  const { setupData } = useRegister();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = setupData?.token;
      if (!token || !userId) {
        throw new Error("No token or user ID available");
      }
      const response = await getWorkerReviews(userId, token);
      const reviewsData = response.data || [];
      setReviews(reviewsData);
      
      // Calculate average rating from reviews
      const avgRating = reviewsData.length > 0
        ? reviewsData.reduce((sum, review) => sum + review.calificacion, 0) / reviewsData.length
        : 0;
      
      setAverageRating(avgRating);
      setTotalReviews(response.total || 0);
    } catch (err: any) {
      console.error("Error fetching worker reviews:", err);
      setError(err?.message || "Error al cargar reseñas");
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [setupData?.token, userId]);

  useEffect(() => {
    console.log("setupData", setupData);

    if (setupData?.token && userId && !hasFetched.current) {
      hasFetched.current = true;
      fetchReviews();
    }
  }, [setupData?.token, userId, fetchReviews]);

  return { reviews, averageRating, totalReviews, isLoading, error, refetch: fetchReviews };
};
