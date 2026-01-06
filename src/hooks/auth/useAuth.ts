import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshSession } from "../../services/auth/refresh/refreshAuth.service";

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      try {
        const { authenticated } = await refreshSession();
        if (authenticated) {
          router.push("/home");
        } else {
          setIsLoading(false);
        }
        
      } catch (err) {
        setIsLoading(false);
      }
    };
    validate();
  }, [router]);

  return { isLoading };
};