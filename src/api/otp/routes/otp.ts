'use strict';

/**
 * otp router
 */

// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::otp.otp', ({ strapi }) => {
  // Auth
  return [
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
  ];
});
