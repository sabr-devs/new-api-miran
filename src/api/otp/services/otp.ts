"use strict";
const isAfter = require("date-fns").isAfter;
const randomInt = require("crypto").randomInt;
const addMinutes = require("date-fns").addMinutes;
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
/**
 * otp service
 */

// @ts-ignore
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::otp.otp", ({ strapi }) => ({
  async verifyOtp(email, code) {
    const otpEntry = await strapi.db.query("api::otp.otp").findOne({
      where: {
        code,
        user: { email: { $eq: email } },
      },
    });

    if (!otpEntry) return false;

    const now = new Date().toISOString();

    if (!isAfter(new Date(otpEntry.expiresAt), new Date(now))) return false;

    await strapi
      .documents("api::otp.otp")
      .delete({ documentId: otpEntry.documentId });

    return true;
  },
  async verifyCode(ctx) {
    const { code, email } = ctx.request.body;
    // console.log(code, email);
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { email } });
    // console.log(user);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    let isValid = false;

    isValid = await strapi.service("api::otp.otp").verifyOtp(email, code);

    if (!isValid) {
      return { success: false, message: "Invalid code" };
    }
    await strapi.query("plugin::users-permissions.user").update({
      where: { id: user.id },
      data: {
        confirmed: true,
      },
    });
    await strapi
    .documents("plugin::users-permissions.user")
    .update({ documentId: user.documentId, data: { confirmed: true } });
    return {
      success: true,
      message: "Code verified successfully",
    };
  },
  async sendCode(ctx) {
    const { email } = ctx.request.body;
    const existingUser = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: { email },
      });
    // console.log(existingUser);
    if (!existingUser) {
      return { success: false, message: "User not found" };
    }
    if (existingUser.confirmed) {
      return { success: false, message: "User already confirmed" };
    }
    if (existingUser.otp_sent > 5) {
      return { success: false, message: "Too many attempts" };
    }
    const now = new Date(new Date().toISOString());
    const expiresAt = addMinutes(now, 3);
    const code = randomInt(1000_000).toString().padStart(6, "0");
    const otpEntry = await strapi.documents("api::otp.otp").create({
      data: {
        code,
        expiresAt,
        user: existingUser.id,
      },
    });
    if (!otpEntry) return ctx.send({ success: false });
    try {
      // Load the .hbs template file
      const templatePath = path.join(
        process.cwd(),
        "src",
        "email-templates",
        "otp-email.hbs"
      );
      const templateContent = fs.readFileSync(templatePath, "utf8");
      // Compile the template with Handlebars
      const template = handlebars.compile(templateContent);

      // Render the template with dynamic data
      const html = template({
        code, // Pass the OTP code
        fullname: existingUser.fullname, // Pass other dynamic data
        email: existingUser.email,
      });

      // Send the email
      await strapi.plugin("email").service("email").send({
        to: existingUser.email,
        from: "info@community-execution.com",
        subject: "رمز التحقق ـ منصة تنفيذ",
        html, // Use the rendered HTML
      });

      existingUser.otp_sent = +existingUser.otp_sent + 1;
      await strapi
        .documents("plugin::users-permissions.user")
        .update({ documentId: existingUser.documentId, data: { otp_sent: existingUser.otp_sent } });
      return {
        success: true,
        email: existingUser.email,
      };
    } catch (error) {
      strapi.log.error("Failed to send email:", error);
      return ctx.internalServerError("Failed to send OTP email.");
    }
  },
  async verifyResetCode(ctx) {
    const { code, email } = ctx.request.body;
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { email } });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const resetToken = await strapi.db.query("api::reset-token.reset-token").findOne({
      where: {
        code,
        user: user.id,
        used: false,
        expiresAt: { $gt: new Date() }
      }
    });

    if (!resetToken) {
      return { success: false, message: "Invalid or expired code" };
    }

    // Mark token as used
    await strapi.db.query("api::reset-token.reset-token").update({
      where: { id: resetToken.id },
      data: { used: true }
    });

    return {
      success: true,
      message: "Code verified successfully",
      code // Return the verified code
    };
  },

  async createResetToken(email) {
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { email } });

    if (!user) return null;

    const now = new Date();
    const expiresAt = addMinutes(now, 30); // 30 minutes expiry
    const code = randomInt(1000_000).toString().padStart(6, "0");

    // Delete any existing reset tokens for this user
    await strapi.db.query("api::reset-token.reset-token").delete({
      where: { user: user.id }
    });

    const resetToken = await strapi.db.query("api::reset-token.reset-token").create({
      data: {
        code,
        expiresAt,
        user: user.id,
        used: false
      }
    });

    return resetToken;
  }
}));
