/**
 * efficacy-evaluation-question service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
    "api::efficacy-evaluation-question.efficacy-evaluation-question",
  ({ strapi }) => ({
    getEfficacyAssessmentQuestions: async () => {
      const efficacyAssessmentQuestions = await strapi.entityService.findMany(
        "api::efficacy-evaluation-question.efficacy-evaluation-question",
        {
          fields: ["questions"],
        }
      );
      return efficacyAssessmentQuestions.questions;
    },
  })
);
