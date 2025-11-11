/**
 * miran-evidence service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::miran-evidence.miran-evidence', ({ strapi }) => ({
      getAllEvidence: async () => {
    const evidences = await strapi.entityService.findMany(
      "api::miran-evidence.miran-evidence",
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
    return evidences;
  },
  getSingleEvidence: async (slug) => {
    const evidence = await strapi.entityService.findMany(
      "api::miran-evidence.miran-evidence",
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
    if (evidence) {
      return evidence
    }
    return null
  },
  getEvidencePdf: async (userId,slug) => {
    const isAllowed = await strapi.service("api::user-profile.user-profile").findOneByUser(userId);
    console.log(isAllowed[0]?.status)
    if (isAllowed[0]?.status) {
    const evidencePdf = await strapi.entityService.findMany(
      "api::miran-evidence.miran-evidence",
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
    if (evidencePdf) {
      const updateEvidencePdf = await strapi.entityService.update(
        "api::miran-evidence.miran-evidence",
        evidencePdf[0].id,
        {
          data: {
            download_count: +evidencePdf[0].download_count + 1
          }
        }
      )

      return {...evidencePdf[0], download_count: updateEvidencePdf.download_count}
    }
    return null
  } else {
    return null
  }
  }
}));
