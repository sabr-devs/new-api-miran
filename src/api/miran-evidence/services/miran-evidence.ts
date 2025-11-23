/**
 * miran-evidence service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::miran-evidence.miran-evidence",
  ({ strapi }) => ({

    getMiranEvidences: async (ctx) => {
      try {
        const { page = 1, pageSize = 10, sort = "createdAt:desc" } = ctx.query;
        const filters: any = {};
        const evidences = await strapi
          .documents("api::miran-evidence.miran-evidence")
          .findMany({
            filters,
            populate: {
              evidence_cover: {
                fields: ["url", "width", "height"],
              },
              evidence_like: {
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
        if (!evidences) {
          return {
            success: false,
            message: "No evidences found",
          };
        }
        // calculate like count for each magazine
        const evidencesWithLikeCount = evidences.map((evidence) => {
          const likeCount = evidence?.evidence_like?.users?.length || 0;
          // convert magazine to plain object to allow editing
          const evidencesData = JSON.parse(JSON.stringify(evidence));
          // remove magazine_like field
          delete evidencesData.evidence_like;
          // add like count instead
          evidencesData.evidenceLikeCount = likeCount;
          return evidencesData;
        });
        return {
          success: true,
          data: evidencesWithLikeCount,
          meta: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total: await strapi
              .documents("api::miran-evidence.miran-evidence")
              .count(filters),
          },
        };
      } catch (error) {
        throw error;
      }
    },
    getMiranEvidenceBySlug: async (ctx) => {
      try {
        const { slug } = ctx.params;
        const evidence = await strapi
          .documents("api::miran-evidence.miran-evidence")
          .findMany({
            filters: { slug: slug },
            populate: {
              evidence_cover: {
                fields: ["url", "width", "height"],
              },
              evidence_like: {
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
        if (!evidence || evidence.length === 0) {
          return {
            success: false,
            message: "evidence not found",
          };
        }
        // calculate like count
        const evidenceLikeCount =
          evidence[0]?.evidence_like?.users?.length || 0;

        // convert tool[0] to plain object to allow editing
        const evidenceData = JSON.parse(JSON.stringify(evidence[0]));

        // remove magazine_like field
        delete evidenceData.evidence_like;

        // add like count instead
        evidenceData.evidenceLikeCount = evidenceLikeCount;
        return {
          success: true,
          data: evidenceData,
        };
      } catch (error) {
        throw error;
      }
    },

  })
);
