/**
 * advisory-jury service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::advisory-jury.advisory-jury",
  ({ strapi }) => ({
    getMiranAdvisoryBoards: async (ctx) => {
      try {
        const advisoryBoards = await strapi
          .documents("api::advisory-jury.advisory-jury")
          .findMany({
            sort: ["sort_order"],
            status: "published",
            populate: {
              image: {
                fields: ["url", "width", "height"],
              },
            },
          });
        if (!advisoryBoards) {
          return {
            success: false,
            message: "advisoryBoards not found",
          };
        }
        return {
          success: true,
          data: advisoryBoards,
        };
      } catch (error) {
        throw error;
      }
    },
  })
);
