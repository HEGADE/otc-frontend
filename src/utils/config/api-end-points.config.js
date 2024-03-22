export const API = {
  register: "auth/register",
  login: "auth/login",
  generateTwoStepCodeQr: "auth/generate-google-auth-code",
  forgotPassword: "auth/forgot-password",
  resetPassword: "auth/reset-password",
  verifyEmail: "auth/verify-email",
  verifyPhoneNumber: "auth/verify-otp",
  sendTokenForEmailVerification: "auth/send-verification-email",
  sendOtpForPhoneNumVerification: "auth/send-otp",
  getUserDetails: "users/auth-user-info",
  saveUserDetails: (userId) => `users/${userId}`,
  getBankDetails: "bank",
  getAdminBankDetails: "bank/get-admin-bank-details",
  saveBankDetails: "bank",
  createOrder: "order",
};
