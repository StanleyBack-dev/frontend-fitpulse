import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/app/services/authService";

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      try {
        const { authenticated } = await checkSession();
        if (authenticated) {
          router.push("/events");
        } else {
          setIsLoading(false); // Só para de carregar se NÃO estiver logado
        }
      } catch (err) {
        setIsLoading(false);
      }
    };
    validate();
  }, [router]);

  return { isLoading };
};