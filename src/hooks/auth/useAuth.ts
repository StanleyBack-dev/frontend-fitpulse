import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "../../services/auth/validate/validateAuth.service";

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      try {
        const { authenticated } = await checkSession();
        if (authenticated) {
          router.push("/");
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