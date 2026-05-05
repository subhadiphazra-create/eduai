export interface RegisterRequest { name: string; email: string; password: string; appId: string; }
export interface LoginRequest { email: string; password: string; appId: string; }
export interface VerifyOtpRequest { email: string; otp: string; type: string; appId: string; }
export interface RefreshTokenRequest { refreshToken: string; }
export interface AuthTokens { accessToken: string; refreshToken: string; }
export interface UserResponse { id: string; name: string; email: string; role: string; avatar?: string; }
export interface AuthResponse { data: { accessToken: string; refreshToken: string; user: UserResponse; }; }
export interface ApiError { status: number; data: { message: string }; }
