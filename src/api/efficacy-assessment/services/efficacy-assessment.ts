/**
 * efficacy-assessment service
 */

import { factories } from '@strapi/strapi';
const assessment_finished_check = (answers) => {
  try {
    const result = answers.every((q) => q.answer !== 0);
    return result;
  } catch (error) {
    throw error;
  }
};
const assessment_calulate_score = (answers) => {
  const grouped_answerd = answers.reduce((acc, item) => {
    const { section_group, answer } = item;
    if (!acc[section_group]) {
      acc[section_group] = 0;
    }
    acc[section_group] += answer;
    return acc;
  }, {});

  return grouped_answerd;
};
export default factories.createCoreService(
      "api::efficacy-assessment.efficacy-assessment",
  ({ strapi }) => ({
    getUserEfficiencyAssessment: async (userId) => {
      try {
        const userEfficiencyAssessment = await strapi.entityService.findMany(
          "api::efficacy-assessment.efficacy-assessment",
          {
            filters: { user: userId },
          }
        );

        if (!userEfficiencyAssessment.length) {
          return {
            success: false,
            message: "No efficiency assessment found",
          };
        }

        let assessment = userEfficiencyAssessment[0];

        // Check if `results` exists and is not null
        if (assessment.results) {
          // Define the required order
          const order = ["VDS", "PE", "CE", "CEf", "LDS"];

          // Sort the results based on the predefined order
          assessment.results = Object.fromEntries(
            order
              .filter((key) => assessment.results[key] !== undefined) // Keep only existing keys
              .map((key) => [key, assessment.results[key]]) // Convert to [key, value] pairs
          );
        }

        return {
          success: true,
          data: assessment, // Return the updated assessment with sorted results
        };
      } catch (error) {
        throw error;
      }
    },
    saveUserEfficacyAssessment: async (ctx) => {
      try {
        const userEfficiencyAssessment = await strapi.entityService.findMany(
          "api::efficacy-assessment.efficacy-assessment",
          {
            filters: {
              user: ctx.state.user.id,
            },
          }
        );
        if (userEfficiencyAssessment.length) {
          const res = await strapi.entityService.update(
            "api::efficacy-assessment.efficacy-assessment",
            userEfficiencyAssessment[0].id,
            {
              data: {
                answers: ctx.request.body,
              },
            }
          );
          if (assessment_finished_check(res.answers)) {
            const scores = assessment_calulate_score(res.answers);
            console.log("scores", scores);
            const updateAssessment = await strapi.entityService.update(
              "api::efficacy-assessment.efficacy-assessment",
              res.id,
              {
                data: {
                  results: scores,
                },
              }
            )
            // console.log("scores", updateAssessment);
          }
          return res;
        }
        const res = await strapi.entityService.create(
          "api::efficacy-assessment.efficacy-assessment",
          {
            data: {
              answers: ctx.request.body,
              user: ctx.state.user.id,
            },
          }
        );
        if (assessment_finished_check(res.answers)) {
          const scores = assessment_calulate_score(res.answers);
          const updateAssessment = await strapi.entityService.update(
            "api::efficacy-assessment.efficacy-assessment",
            res.id,
            {
              data: {
                results: scores,
              },
            }
          )
          // console.log("scores", updateAssessment);
        }
        return res;
      } catch (error) {
        throw error;
      }
    },
  })
);
