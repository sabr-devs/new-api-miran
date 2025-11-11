// import { randomInt } from "crypto";
// import { addMinutes } from "date-fns";

import { randomInt } from "crypto";
import { addMinutes } from "date-fns";
import axios from "axios";
import { getService } from "./utils";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");
  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

module.exports = (plugin) => {
  const rawAuth = plugin.controllers.auth({ strapi });
  const auth = ({ strapi }) => {
    return {
      ...rawAuth,
      callback: async (ctx) => {
        const provider = ctx.params.provider;
        if (!provider) {
          const { identifier, password } = ctx.request.body;
          // Handle the local authentication logic (email and password)
          // console.log(identifier, password);
          const user = await strapi
            .query("plugin::users-permissions.user")
            .findOne({
              where: { email: identifier },
            });
          // console.log(user);
          if (!user) {
            return ctx.badRequest("User not found.");
          }
          // Check if the password matches
          const validPassword = await strapi.plugins[
            "users-permissions"
          ].services.user.validatePassword(password, user.password);
          if (!validPassword) {
            const now = new Date();
            let { loginAttempts, lockoutUntil } = user;
            loginAttempts = loginAttempts + 1;
            if (loginAttempts >= 5) {
              lockoutUntil = addMinutes(now, 5);
            }
            await strapi.query("plugin::users-permissions.user").update({
              where: { id: user.id },
              data: {
                loginAttempts,
                lockoutUntil,
              },
            });
            if (loginAttempts >= 5) {
              return ctx.badRequest("Too many login attempts.");
            }
            return ctx.badRequest("Invalid password.");
          }
          if (!user.confirmed) {
            return ctx.badRequest("Email Not confirmed.");
          }
          await strapi.query("plugin::users-permissions.user").update({
            where: { id: user.id },
            data: {
              loginAttempts: 0,
              lockoutUntil: null,
            },
          });
          // Issue JWT for local login
          return {
            success: true,
            data: {
              jwt: strapi.plugins["users-permissions"].services.jwt.issue({
                id: user.id,
              }),
              user: await sanitizeUser(user, ctx),
            },
          };
        }
        if (provider === "google") {
          const { access_token } = ctx.query;

          try {
            // Fetch user info from Google
            const googleRes = await axios.get(
              `https://www.googleapis.com/oauth2/v3/userinfo`,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            );

            const { email, name: fullname, picture: pic } = googleRes.data;
            const username = email; // Alternatively, use a different unique identifier

            // Check if the user already exists
            const existingUser = await strapi
              .query("plugin::users-permissions.user")
              .findOne({
                where: { email },
              });

            if (!existingUser) {
              // Fetch the 'Authenticated' role dynamically
              const authenticatedRole = await strapi
                .query("plugin::users-permissions.role")
                .findOne({
                  where: { type: "authenticated" },
                });

              if (!authenticatedRole) {
                strapi.log.error(
                  "Authenticated role not found in the database."
                );
                return ctx.internalServerError(
                  "Authentication service is currently unavailable. Please try again later."
                );
              }

              // Create new user with the fetched role ID
              const newUser = await getService("user").add({
                email,
                username,
                fullname,
                confirmed: true,
                role: authenticatedRole.id, // Use dynamic role ID
                provider: "local", // Correct provider
                pic,
                init_pass: true,
              });

              return ctx.send({
                jwt: getService("jwt").issue({ id: newUser.id }),
                user: await sanitizeUser(newUser, ctx),
              });
            }

            // Existing user found
            // Check if the user lacks a profile picture
            if (pic !== existingUser.pic) {
              // Update the user's 'pic' field with the one from Google
              await getService("user").edit(existingUser.id, { pic });
              // Optionally, fetch the updated user data
              existingUser.pic = pic; // Update the local variable to reflect changes
            }
            if (existingUser.confirmed === false) {
              await getService("user").edit(existingUser.id, {
                confirmed: true,
              });
            }
            // Issue JWT and return user data
            return ctx.send({
              jwt: getService("jwt").issue({ id: existingUser.id }),
              user: await sanitizeUser(existingUser, ctx),
            });
          } catch (error) {
            strapi.log.error("Google OAuth Callback Error:", error);
            return ctx.badRequest("Authentication failed. Please try again.");
          }
        } else {
          // Fallback to default callback for other providers
          await rawAuth.callback(ctx);
        }
      },
      // register: async (ctx) => {
      //   const { email, username, password, fullname,governorate,region,phone } = ctx.request.body;
      //   if( !email || !username || !password || !fullname || !governorate || !region || !phone){
      //     return ctx.send({
      //       success: false,
      //       message: "All fields are required",
      //     });
      //   }
      //   const existingUser = await strapi
      //     .query("plugin::users-permissions.user")
      //     .findOne({
      //       where: { email },
      //     });
      //   if (existingUser) {
      //     return ctx.send({
      //       success: false,
      //       message: "User already exists",
      //     });
      //   }
      //   const authenticatedRole = await strapi
      //     .query("plugin::users-permissions.role")
      //     .findOne({
      //       where: { type: "authenticated" },
      //     });

      //   if (!authenticatedRole) {
      //     strapi.log.error("Authenticated role not found in the database.");
      //     return ctx.internalServerError(
      //       "Authentication service is currently unavailable. Please try again later."
      //     );
      //   }
      //   const addUser = await strapi
      //     .documents("plugin::users-permissions.user")
      //     .create({
      //       data: {
      //         email,
      //         username,
      //         password,
      //         fullname,
      //         role: authenticatedRole.id, 
      //         provider: "local",
      //         init_pass: false,
      //         otp_sent: 1,
      //         governorate,
      //         region,
      //         phone
      //       },
      //     });
      //   const now = new Date(new Date().toISOString());
      //   const expiresAt = addMinutes(now, 3);
      //   const code = randomInt(1000_000).toString().padStart(6, "0");

      //   const otpEntry = await strapi.documents("api::otp.otp").create({
      //     data: {
      //       code,
      //       expiresAt,
      //       user: addUser.id,
      //     },
      //   });
      //   if (!otpEntry) return ctx.send({ success: false });
      //   try {
      //     // Load the .hbs template file
      //     const templatePath = path.join(
      //       process.cwd(),
      //       "src",
      //       "email-templates",
      //       "otp-email.hbs"
      //     );
      //     const templateContent = fs.readFileSync(templatePath, "utf8");
      //     // Compile the template with Handlebars
      //     const template = handlebars.compile(templateContent);

      //     // Render the template with dynamic data
      //     const html = template({
      //       code, // Pass the OTP code
      //       fullname: addUser.fullname, // Pass other dynamic data
      //       email: addUser.email,
      //     });

      //     // Send the email
      //     await strapi.plugin("email").service("email").send({
      //       to: addUser.email,
      //       from: "info@community-execution.com",
      //       subject: "رمز التحقق ـ منصة تنفيذ",
      //       html, // Use the rendered HTML
      //     });

      //     return ctx.send({
      //       success: true,
      //       email: addUser.email,
      //     });
      //   } catch (error) {
      //     strapi.log.error("Failed to send email:", error);
      //     return ctx.internalServerError("Failed to send OTP email.");
      //   }
      // },
      changePassword: async (ctx) => {
        const { init_pass } = ctx.request.body;
        // console.log(init_pass);
        if (init_pass) {
          const { password } = ctx.request.body;
          await getService("user").edit(ctx.state.user.id, {
            password,
            init_pass: false,
          });
          ctx.send({
            jwt: getService("jwt").issue({ id: ctx.state.user.id }),
            user: await sanitizeUser(ctx.state.user, ctx),
          });
        } else {
          // console.log(ctx.request.body);
          await rawAuth.changePassword(ctx);
        }
      },
    };
  };
  plugin.controllers.auth = auth;

  return plugin;
};
