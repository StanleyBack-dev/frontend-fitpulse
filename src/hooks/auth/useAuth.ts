import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { refreshSession } from "../../services/auth/refresh/refreshAuth.service";

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      if (pathname !== "/") {
        setIsLoading(false);
        return;
      }

      try {
        const { authenticated } = await refreshSession();
        if (authenticated) {
          router.push("/home");
        } else {
          setIsLoading(false);
        }
      } catch {
        setIsLoading(false);
      }
    };

    validate();
  }, [router, pathname]);

  return { isLoading };
};