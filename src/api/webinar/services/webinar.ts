/**
 * webinar service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::webinar.webinar",
  ({ strapi }) => ({
    getMiranWebinars: async (ctx) => {
      try {
        const { page = 1, pageSize = 10, sort = "createdAt:desc" } = ctx.query;
        const filters: any = {};
        const evidences = await strapi
          .documents("api::webinar.webinar")
          .findMany({
            filters,
            populate: {
              image: {
                fields: ["url", "width", "height"],
              },
              author: {
                populate: {
                  author_image: {
                    fields: ["url", "width", "height"],
                  },
                },
              },
            },
            start: (page - 1) * pageSize,
            limit: pageSize,
            sort,
          });
        if (!evidences) {
          return {
            success: false,
            message: "No evidences found",
          };
        }
        return {
          success: true,
          data: evidences,
          meta: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total: await strapi
              .documents("api::webinar.webinar")
              .count(filters),
          },
        };
      } catch (error) {
        throw error;
      }
    },
    getMiranWebinarByID: async (ctx) => {
      try {
        const { id } = ctx.params;
        const webinar = await strapi
          .documents("api::webinar.webinar")
          .findMany({
            filters: { documentId: id },
            populate: {
              image: {
                fields: ["url", "width", "height"],
              },
              author: {
                populate: {
                  author_image: {
                    fields: ["url", "width", "height"],
                  },
                },
              },
            },
          });
        if (!webinar || webinar.length === 0) {
          return {
            success: false,
            message: "webinar not found",
          };
        }
        return {
          success: true,
          data: webinar[0],
        };
      } catch (error) {
        throw error;
      }
    },
    getUpcomingWebinars: async (
      ctx
    ) => {
      try {
        const { page = 1, pageSize = 10, sort = "createdAt:desc" } = ctx.query;

        const now = new Date().toISOString();
        const webinars = await strapi
          .documents("api::webinar.webinar")
          .findMany({
            filters: {
              webinar_date: {
                $gte: now,
              },
            },
            populate: {
              image: {
                fields: ["url", "width", "height"],
              },
              author: {
                populate: {
                  author_image: {
                    fields: ["url", "width", "height"],
                  },
                },
              },
            },
            start: (page - 1) * pageSize,
            limit: pageSize,
            sort: { webinar_date: "asc" }, // optional: sort by soonest
          });

        return {
          success: true,
          data: webinars,
        };
      } catch (error) {
        throw error;
      }
    },
  })
);
