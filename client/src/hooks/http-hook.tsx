import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

export function useHttpClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async (
      url: string,
      method = "GET",
      body: string | null = null,
      headers = {},
      successMsg?: string | null
    ) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        if (successMsg) {
          toast.success(successMsg);
        }
        return responseData;
      } catch (err) {
        if (err instanceof Error) {
          // Prevent throwing an error for aborted requests
          if (err.name === "AbortError") {
            console.warn("Request was aborted:", url);
            return;
          }
          setError(err.message);
          // toast.error(err.message || "An unknown error occurred.");
        } else {
          setError("An unknown error occurred");
        }
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
}
