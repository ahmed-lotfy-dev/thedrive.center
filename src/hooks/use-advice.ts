import { useQuery } from "@tanstack/react-query";

interface Advice {
  id: string;
  content: string;
}

async function fetchRandomAdvice(): Promise<Advice | null> {
  const res = await fetch("/api/advices/random");
  if (!res.ok) return null;
  return res.json();
}

export function useRandomAdvice() {
  return useQuery({
    queryKey: ["advice", "random"],
    queryFn: fetchRandomAdvice,
    staleTime: 5 * 60 * 1000,
  });
}