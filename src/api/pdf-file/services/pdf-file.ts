/**
 * pdf-file service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::pdf-file.pdf-file",
  ({ strapi }) => ({
    updateDownloadCount: async (ctx) => {
      try {
        const getFile = await strapi
          .documents("api::pdf-file.pdf-file")
          .findOne({ documentId: ctx.params.id });
        if (!getFile) {
          return {
            success: false,
            message: "File not found",
          };
        }
        const file = await strapi.documents("api::pdf-file.pdf-file").update({
          documentId: ctx.params.id,
          data: {
            downloads_count: getFile.downloads_count + 1,
          },
        });
        return {
          success: !!file, // Returns true if file exists
          data: file || null, // Ensures null if empty
        };
      } catch (error) {
        strapi.log.error("File update error:", error);
        return {
          success: false,
          error: error.message,
        };
      }
    },
  })
);
