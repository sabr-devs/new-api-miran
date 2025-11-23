/**
 * miran-tool service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::miran-tool.miran-tool",
  ({ strapi }) => ({
    getMiranTools: async (ctx) => {
      try {
        const { page = 1, pageSize = 10, sort = "createdAt:desc" } = ctx.query;
        const filters: any = {};
        const tools = await strapi
          .documents("api::miran-tool.miran-tool")
          .findMany({
            filters,
            populate: {
              tool_cover: {
                fields: ["url", "width", "height"],
              },
              tool_like: {
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
        if (!tools) {
          return {
            success: false,
            message: "No tools found",
          };
        }
        // calculate like count for each magazine
        const toolsWithLikeCount = tools.map((tool) => {
          const likeCount = tool?.tool_like?.users?.length || 0;
          // convert magazine to plain object to allow editing
          const toolsData = JSON.parse(JSON.stringify(tool));
          // remove magazine_like field
          delete toolsData.tool_like;
          // add like count instead
          toolsData.toolLikeCount = likeCount;
          return toolsData;
        });
        return {
          success: true,
          data: toolsWithLikeCount,
          meta: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total: await strapi
              .documents("api::miran-tool.miran-tool")
              .count(filters),
          },
        };
      } catch (error) {
        throw error;
      }
    },
    getMiranToolBySlug: async (ctx) => {
      try {
        const { slug } = ctx.params;
        const tool = await strapi
          .documents("api::miran-tool.miran-tool")
          .findMany({
            filters: { slug: slug },
            populate: {
              tool_cover: {
                fields: ["url", "width", "height"],
              },
              tool_like: {
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
        if (!tool || tool.length === 0) {
          return {
            success: false,
            message: "tool not found",
          };
        }
        // calculate like count
        const toolLikeCount =
          tool[0]?.tool_like?.users?.length || 0;

        // convert tool[0] to plain object to allow editing
        const toolData = JSON.parse(JSON.stringify(tool[0]));

        // remove magazine_like field
        delete toolData.tool_like;

        // add like count instead
        toolData.toolLikeCount = toolLikeCount;
        return {
          success: true,
          data: toolData,
        };
      } catch (error) {
        throw error;
      }
    },
  })
);
