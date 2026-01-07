import { useMutation } from "@tanstack/react-query";
import { createHealth } from "../../services/healths/create/createHealth.service";

export function useCreateHealth() {
  return useMutation({
    mutationFn: createHealth,
  });
}