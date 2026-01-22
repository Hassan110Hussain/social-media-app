export const ROUTES = {
  home: '/',
  login: '/login',
  signUp: '/sign-up',
  forgetPassword: '/forget-password',
  resetPassword: '/reset-password',
  onboarding: '/onboarding',
  dashboardHome: '/home',
  authCallback: '/auth/callback',
} as const;

export type RouteKey = keyof typeof ROUTES;
