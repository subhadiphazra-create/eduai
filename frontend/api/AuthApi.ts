import { baseApi } from "@/lib/baseApi";
import type { AuthResponse, LoginRequest, RegisterRequest, VerifyOtpRequest, RefreshTokenRequest } from "@/types/auth";
import Cookies from "js-cookie";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<{ data: { id: string; email: string } }, RegisterRequest>({
      query: (data) => ({ url: "auth/register", method: "POST", body: data }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({ url: "auth/login", method: "POST", body: data }),
      invalidatesTags: ["Auth"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          Cookies.set("accessToken", data.data.accessToken, { expires: 1 / 96 }); // 15 min
          Cookies.set("refreshToken", data.data.refreshToken, { expires: 7 });
        } catch {}
      },
    }),
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (data) => ({ url: "auth/verify-otp", method: "POST", body: data }),
      invalidatesTags: ["Auth"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.accessToken) {
            Cookies.set("accessToken", data.data.accessToken, { expires: 1 / 96 });
            Cookies.set("refreshToken", data.data.refreshToken, { expires: 7 });
          }
        } catch {}
      },
    }),
    refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (data) => ({ url: "auth/refresh-token", method: "POST", body: data }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          Cookies.set("accessToken", data.data.accessToken, { expires: 1 / 96 });
          Cookies.set("refreshToken", data.data.refreshToken, { expires: 7 });
        } catch {}
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
        } catch {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
