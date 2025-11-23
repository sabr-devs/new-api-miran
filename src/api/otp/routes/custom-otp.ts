module.exports = {
  routes: [
    {
      method: "POST",
      path: "/otp/verify-code",
      handler: "otp.verifyCode",
    },
    {
      method: "POST",
      path: "/otp/send-code",
      handler: "otp.sendCode",
    },
  ],
};