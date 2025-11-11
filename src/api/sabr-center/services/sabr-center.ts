"use strict";

/**
 * sabr-center service
 */

module.exports = ({ strapi }) => ({
  getAllUsers: async () => {
    try {
      const users = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          fields: [
            "email",
            "fullname",
            "confirmed",
            "blocked",
            "fullname",
            "createdAt",
          ],
        }
      );
      // console.log("users", users)

      if (users) {
        return {
          success: true,
          data: users,
        };
      }
    } catch (error) {
      throw error;
    }
  },
});
