'use client';

import { useSearchParams } from "next/navigation";

export function useGetAllSearchParams() {
  const searchParams = useSearchParams();
  const params = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
