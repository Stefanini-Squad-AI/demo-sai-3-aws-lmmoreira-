import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthState, LoginCredentials, ApiResponse } from "~/types";
import { apiClient } from "~/services/api";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("auth-token"),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Interfaz para la respuesta del backend
interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  fullName: string;
  userType: string;
  expiresIn: number;
  message: string;
}

// ✅ CORRECCIÓN: Helper para verificar si es ApiResponse
function isApiResponse<T>(response: T | ApiResponse<T>): response is ApiResponse<T> {
  return typeof response === 'object' && response !== null && 'success' in response;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<BackendAuthResponse>(
        "/auth/login",
        credentials
      );

      // ✅ CORRECCIÓN: Manejo correcto de tipos de respuesta
      let authData: BackendAuthResponse;
      
      if (isApiResponse(response)) {
        // Es una ApiResponse wrapper
        if (response.success && response.data) {
          authData = response.data;
        } else {
          return rejectWithValue(response.error || "Login failed");
        }
      } else {
        // Es una respuesta directa del backend
        authData = response;
      }
      
      // Mapear respuesta del backend a nuestro formato
      const user: User = {
        id: 1, // ID numérico para compatibilidad
        userId: authData.userId,
        name: authData.fullName,
        role: authData.userType === 'A' ? 'admin' : 'back-office',
        avatar: `https://i.pravatar.cc/150?u=${authData.userId}`,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      // Almacenar tokens y datos de usuario de forma segura
      localStorage.setItem("auth-token", authData.accessToken);
      localStorage.setItem("refresh-token", authData.refreshToken);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userId", user.userId);
      
      sessionStorage.setItem("user-session", JSON.stringify({
        userId: authData.userId,
        userType: authData.userType,
        role: user.role,
        loginTime: Date.now()
      }));

      return {
        token: authData.accessToken,
        refreshToken: authData.refreshToken,
        user,
        expiresIn: authData.expiresIn
      };
    } catch (error: any) {
      // Manejar errores específicos del backend
      if (error.status === 401) {
        return rejectWithValue("Invalid credentials");
      }
      if (error.status === 400) {
        return rejectWithValue("Please check your input");
      }
      return rejectWithValue(
        error.message || "Network error occurred"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => { // ✅ CORRECCIÓN: Remover rejectWithValue no usado
    try {
      // Limpiar estado inmediatamente antes de la llamada API
      dispatch(immediateLogout());
      
      // Intentar llamar al endpoint de logout (opcional)
      try {
        await apiClient.post("/auth/logout");
      } catch (error) {
        // Continuar con el logout local incluso si falla la llamada
        console.warn('Logout API call failed, but local logout completed:', error);
      }
    } catch (error) {
      // Incluso si hay error, asegurar que el logout local se complete
      dispatch(immediateLogout());
      console.warn('Logout process completed despite errors:', error);
    }
    
    return null;
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshTokenValue = localStorage.getItem("refresh-token");
      
      if (!refreshTokenValue) {
        return rejectWithValue("No refresh token available");
      }

      const response = await apiClient.post<{ accessToken: string }>("/auth/refresh", {
        refreshToken: refreshTokenValue
      });

      // ✅ CORRECCIÓN: Manejo correcto de tipos de respuesta
      let tokenData: { accessToken: string };
      
      if (isApiResponse(response)) {
        // Es una ApiResponse wrapper
        if (response.success && response.data) {
          tokenData = response.data;
        } else {
          return rejectWithValue(response.error || "Token refresh failed");
        }
      } else {
        // Es una respuesta directa del backend
        tokenData = response;
      }

      localStorage.setItem("auth-token", tokenData.accessToken);
      return tokenData.accessToken;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Token refresh failed"
      );
    }
  }
);

export const validateToken = createAsyncThunk(
  "auth/validateToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("auth-token");
      const userRole = localStorage.getItem("userRole");
      const userId = localStorage.getItem("userId");
      
      if (!token) {
        return rejectWithValue("No token available");
      }

      const response = await apiClient.post<{ valid: boolean; userId: string }>("/auth/validate", {
        token
      });

      // ✅ CORRECCIÓN: Manejo correcto de tipos de respuesta
      let validationData: { valid: boolean; userId: string };
      
      if (isApiResponse(response)) {
        // Es una ApiResponse wrapper
        if (response.success && response.data) {
          validationData = response.data;
        } else {
          return rejectWithValue("Token validation failed");
        }
      } else {
        // Es una respuesta directa del backend
        validationData = response;
      }

      if (validationData.valid) {
        // Restaurar usuario desde localStorage si existe
        if (userRole && userId) {
          const user: User = {
            id: 1,
            userId: userId,
            name: userRole === 'admin' ? 'Administrator User' : 'Back Office User',
            role: userRole as 'admin' | 'back-office',
            avatar: `https://i.pravatar.cc/150?u=${userId}`,
            createdAt: new Date().toISOString(),
            isActive: true,
          };
          
          return { userId: validationData.userId, user };
        }
        
        return { userId: validationData.userId };
      }

      return rejectWithValue("Token is invalid");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Token validation failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Almacenar rol en localStorage
      localStorage.setItem("userRole", action.payload.user.role);
      localStorage.setItem("userId", action.payload.user.userId);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Limpiar todo el almacenamiento
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      sessionStorage.removeItem("user-session");
    },
    // Acción para logout inmediato y limpieza completa
    immediateLogout: (state) => {
      // Limpiar estado Redux inmediatamente
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      
      // Limpiar almacenamiento inmediatamente
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      sessionStorage.removeItem("user-session");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Logout - Simplificar manejo de logout
      .addCase(logoutUser.pending, (state) => {
        // No mostrar loading para logout, ya que limpiamos inmediatamente
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // El estado ya fue limpiado por immediateLogout
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // El estado ya fue limpiado por immediateLogout
        state.isLoading = false;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Validate Token
      .addCase(validateToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.error = null;
        // Restaurar usuario si se proporciona
        if ('user' in action.payload) {
          state.user = action.payload.user;
        }
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCredentials, clearCredentials, immediateLogout } = authSlice.actions;
export default authSlice.reducer;

// Selectores
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;