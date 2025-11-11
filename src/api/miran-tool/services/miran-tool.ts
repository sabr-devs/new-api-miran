/**
 * miran-tool service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::miran-tool.miran-tool', ({ strapi }) => ({
      getAllTools: async () => {
    const tools = await strapi.entityService.findMany(
      "api::miran-tool.miran-tool",
      {
        status: "published",
        sort: ['createdAt:desc'],
        fields: ['name', 'slug', 'issue_number', 'createdAt','issue_date','excerpt'],
        populate: {
          img: {
            fields: ["url", "width", "height"],
          },

        },
      }
    );
    return tools;
  },
  getSingleTool: async (slug) => {
    const tool = await strapi.entityService.findMany(
      "api::miran-tool.miran-tool",
      {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        fields: ['name', 'excerpt', 'slug', 'issue_number', 'createdAt','download_count','issue_date'],
        populate: {
          img: {
            fields: ["url", "width", "height"],
          }
        },
      }
    );
    if (tool) {
      return tool
    }
    return null
  },
  getToolIssuePdf: async (userId,slug) => {
    const isAllowed = await strapi.service("api::user-profile.user-profile").findOneByUser(userId);
    console.log(isAllowed[0]?.status)
    if (isAllowed[0]?.status) {
    const toolPdf = await strapi.entityService.findMany(
      "api::miran-tool.miran-tool",
      {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        fields: ['download_count'],
        populate: {
          pdf: {
            fields: ["url", "width", "height"],
          }
        },
      }
    );
    if (toolPdf) {
      const updateToolPdf = await strapi.entityService.update(
        "api::miran-tool.miran-tool",
        toolPdf[0].id,
        {
          data: {
            download_count: +toolPdf[0].download_count + 1
          }
        }
      )

      return {...toolPdf[0], download_count: updateToolPdf.download_count}
    }
    return null
  } else {
    return null
  }
  }
}));
