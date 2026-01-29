// ===== app/hooks/useApi.ts =====
import { useState, useEffect, useCallback, useRef } from "react";
import type { ApiResponse } from "~/types";
import { ApiError } from "~/services/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  retries?: number;
  retryDelay?: number;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { 
    immediate = true, 
    onSuccess, 
    onError, 
    retries = 0, 
    retryDelay = 1000 
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const retriesRef = useRef(0);
  const isExecutingRef = useRef(false);

  const execute = useCallback(async () => {
    if (isExecutingRef.current) {
      console.log('⚠️ API call already in progress, skipping');
      return;
    }

    isExecutingRef.current = true;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    retriesRef.current = 0;

    const attemptRequest = async (): Promise<void> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall();

        if (response.success && response.data) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
          onSuccess?.(response.data);
        } else {
          const errorMessage = response.error || "Unknown error occurred";
          setState({
            data: null,
            loading: false,
            error: errorMessage,
          });
          onError?.(errorMessage);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        const errorMessage =
          error instanceof ApiError ? error.message : "Network error occurred";

        if (retriesRef.current < retries) {
          retriesRef.current++;
          setTimeout(attemptRequest, retryDelay * retriesRef.current);
          return;
        }

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        onError?.(errorMessage);
      } finally {
        isExecutingRef.current = false;
      }
    };

    await attemptRequest();
  }, [apiCall, onSuccess, onError, retries, retryDelay]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    isExecutingRef.current = false;
    
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  const hasExecutedRef = useRef(false);
  
  useEffect(() => {
    if (immediate && !hasExecutedRef.current) {
      hasExecutedRef.current = true;
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isExecutingRef.current = false;
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<T | ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { onSuccess, onError } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const mutate = useCallback(
    async (params: P) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await mutationFn(params);
        
        console.log('🎯 useMutation raw result:', result);

        let finalData: T | null = null;
        let hasError = false;
        let errorMessage = '';

        // ✅ CORRECCIÓN CRÍTICA: Lógica unificada para manejar ambos casos
        if (result && typeof result === 'object') {
          
          // 1. Detectar respuesta de error explícita del backend real
          if ('success' in result && result.success === false) {
            hasError = true;
            errorMessage = (result as any).errorMessage || (result as any).error || 'Request failed';
            console.log('❌ Backend real error response:', errorMessage);
          }
          
          // 2. Detectar respuesta exitosa de MSW con wrapper ApiResponse
          else if ('success' in result && result.success === true && 'data' in result) {
            const apiResponse = result as ApiResponse<T>;
            if (apiResponse.data !== null && apiResponse.data !== undefined) {
              finalData = apiResponse.data;
              console.log('✅ MSW ApiResponse detected:', finalData);
            } else {
              hasError = true;
              errorMessage = apiResponse.error || 'No data in successful response';
            }
          }
          
          // 3. Detectar respuesta directa del backend real (Credit Card Update case)
          else if ('currentDate' in result && 'currentTime' in result && 'transactionId' in result) {
            // Es una respuesta directa del backend real para Credit Card Update
            finalData = result as T;
            console.log('✅ Backend real Credit Card Update response:', finalData);
          }
          
          // 4. Detectar respuesta directa del backend real (AccountView case)
          else if (!('success' in result) || 
                   (('success' in result) && typeof (result as any).success !== 'boolean')) {
            // Es una respuesta directa del backend real para AccountView u otros casos
            finalData = result as T;
            console.log('✅ Backend real AccountView response:', finalData);
          }
          
          // 5. Caso por defecto para objetos no identificados
          else {
            finalData = result as T;
            console.log('✅ Default object response:', finalData);
          }
        } 
        
        // 6. Respuesta primitiva o null
        else {
          finalData = result as T;
          console.log('✅ Primitive response:', finalData);
        }

        // Manejar errores detectados
        if (hasError) {
          setState({
            data: null,
            loading: false,
            error: errorMessage,
          });
          onError?.(errorMessage);
          throw new Error(errorMessage);
        }

        // Validar que tenemos datos válidos
        if (finalData === null || finalData === undefined) {
          const nullErrorMessage = 'No valid data received from API';
          setState({
            data: null,
            loading: false,
            error: nullErrorMessage,
          });
          onError?.(nullErrorMessage);
          throw new Error(nullErrorMessage);
        }

        setState({
          data: finalData,
          loading: false,
          error: null,
        });
        
        onSuccess?.(finalData);
        return finalData;
        
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        const errorMessage =
          error instanceof ApiError ? error.message : 
          error instanceof Error ? error.message : 
          "Network error occurred";

        console.error('🚨 useMutation error:', errorMessage);

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        onError?.(errorMessage);
        throw error;
      }
    },
    [mutationFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}