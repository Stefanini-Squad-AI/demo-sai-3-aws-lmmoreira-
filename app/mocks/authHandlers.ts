// app/mocks/authHandlers.ts
import { http, HttpResponse } from "msw";

const API_BASE = "/api";

// Datos mock que coinciden con el backend
const mockUsers = [
  { 
    userId: "ADMIN001", 
    password: "PASSWORD", 
    fullName: "Admin User",
    role: "admin", 
    userType: "A" // Admin
  },
  { 
    userId: "USER001", 
    password: "PASSWORD", 
    fullName: "Back Office User",
    role: "back-office", 
    userType: "U" // User
  },
];

export const authHandlers = [
  // Login endpoint
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { userId: string; password: string };

    console.log('🔐 MSW Login attempt:', body);

    // Validaciones como en el backend
    if (!body.userId || body.userId.trim() === '') {
      return HttpResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    if (!body.password || body.password.trim() === '') {
      return HttpResponse.json(
        {
          success: false,
          error: "Password is required",
        },
        { status: 400 }
      );
    }

    const user = mockUsers.find(u => 
      u.userId === body.userId && u.password === body.password
    );

    if (!user) {
      // Usuario no encontrado
      const userExists = mockUsers.some(u => u.userId === body.userId);
      if (!userExists) {
        return HttpResponse.json(
          {
            success: false,
            error: "User not found",
          },
          { status: 401 }
        );
      }
      
      // Contraseña incorrecta
      return HttpResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Simular respuesta del backend Spring Boot
    const mockResponse = {
      success: true,
      data: {
        accessToken: `mock-jwt-token-${user.userId}-${Date.now()}`,
        refreshToken: `mock-refresh-token-${user.userId}-${Date.now()}`,
        tokenType: "Bearer",
        userId: user.userId,
        fullName: user.fullName,
        userType: user.userType,
        expiresIn: 86400000, // 24 horas
        message: "Authentication successful"
      }
    };

    console.log('✅ MSW Login successful:', mockResponse);
    return HttpResponse.json(mockResponse);
  }),

  // Refresh token endpoint
  http.post(`${API_BASE}/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };

    if (!body.refreshToken) {
      return HttpResponse.json(
        {
          success: false,
          error: "Refresh token is required",
        },
        { status: 400 }
      );
    }

    // Simular validación del refresh token
    if (!body.refreshToken.startsWith('mock-refresh-token-')) {
      return HttpResponse.json(
        {
          success: false,
          error: "Invalid refresh token",
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        accessToken: `mock-jwt-token-refreshed-${Date.now()}`,
        tokenType: "Bearer",
        message: "Token refreshed successfully"
      }
    });
  }),

  // Validate token endpoint
  http.post(`${API_BASE}/auth/validate`, async ({ request }) => {
    const body = (await request.json()) as { token: string };

    if (!body.token) {
      return HttpResponse.json({
        success: true,
        data: {
          valid: false,
          message: "Token is required"
        }
      });
    }

    // Simular validación del token
    const isValid = body.token.startsWith('mock-jwt-token-');
    
    return HttpResponse.json({
      success: true,
      data: {
        valid: isValid,
        userId: isValid ? "USER001" : null,
        message: isValid ? "Token is valid" : "Token is invalid"
      }
    });
  }),

  // Logout endpoint
  http.post(`${API_BASE}/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }),

  // Health check endpoint
  http.get(`${API_BASE}/auth/health`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        status: "UP",
        service: "Authentication Service",
        message: "Service is running"
      }
    });
  }),
];