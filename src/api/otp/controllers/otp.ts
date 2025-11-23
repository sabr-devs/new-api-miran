// @ts-nocheck
'use strict';

/**
 * otp controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::otp.otp', ({ strapi }) => ({
    verifyCode: async (ctx) => {
      try {
        const verify = await strapi
          .service("api::otp.otp")
          .verifyCode(ctx)
        return ctx.send(verify)
      } catch (error) {
        return ctx.throw(400, error);
      }
    },
    sendCode: async (ctx) => {
      try {
        const send = await strapi
          .service("api::otp.otp")
          .sendCode(ctx)
        return ctx.send(send)
      } catch (error) {
        return ctx.throw(400, error);
      }
    },
}));