/**
 * main-magazine service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::main-magazine.main-magazine",
  ({ strapi }) => ({
    getMiranMagazine: async (ctx) => {
      try {
        const { page = 1, pageSize = 10, sort = "createdAt:desc" } = ctx.query;
        const filters: any = {};
        const magazines = await strapi
          .documents("api::main-magazine.main-magazine")
          .findMany({
            filters,
            populate: {
              magazine_cover: {
                fields: ["url", "width", "height"],
              },
              magazine_like: {
                populate: {
                  users: {
                    fields: ["id", "fullname", "email"],
                  },
                },
              },
            },
            start: (page - 1) * pageSize,
            limit: pageSize,
            sort,
          });
        if (!magazines) {
          return {
            success: false,
            message: "No magazines found",
          };
        }
        // calculate like count for each magazine
        const magazinesWithLikeCount = magazines.map((magazine) => {
          const likeCount = magazine?.magazine_like?.users?.length || 0;
          // convert magazine to plain object to allow editing
          const magazineData = JSON.parse(JSON.stringify(magazine));
          // remove magazine_like field
          delete magazineData.magazine_like;
          // add like count instead
          magazineData.magazineLikeCount = likeCount;
          return magazineData;
        });
        return {
          success: true,
          data: magazinesWithLikeCount,
          meta: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total: await strapi
              .documents("api::main-magazine.main-magazine")
              .count(filters),
          },
        };
      } catch (error) {
        throw error;
      }
    },
    getMiranMagazineBySlug: async (ctx) => {
      try {
        const { slug } = ctx.params;
        const magazine = await strapi
          .documents("api::main-magazine.main-magazine")
          .findMany({
            filters: { slug: slug },
            populate: {
              magazine_cover: {
                fields: ["url", "width", "height"],
              },
              magazine_like: {
                populate: {
                  users: {
                    fields: ["id", "fullname", "email"],
                    populate: { user_book_marks: true },
                  },
                },
              },
              pdf_file: {
                populate: {
                  file: {
                    fields: ["url", "width", "height"],
                  },
                },
              },
              sections: true,
            },
          });
        if (!magazine || magazine.length === 0) {
          return {
            success: false,
            message: "Magazine not found",
          };
        }
        // calculate like count
        const magazineLikeCount =
          magazine[0]?.magazine_like?.users?.length || 0;

        // convert magazine[0] to plain object to allow editing
        const magazineData = JSON.parse(JSON.stringify(magazine[0]));

        // remove magazine_like field
        delete magazineData.magazine_like;

        // add like count instead
        magazineData.magazineLikeCount = magazineLikeCount;
        return {
          success: true,
          data: magazineData,
        };
      } catch (error) {
        throw error;
      }
    },
  })
);
