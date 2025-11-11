module.exports = ({ strapi }) => ({
  getCountOfUsers: async (ctx) => {
    try {
      const userId = ctx.state.user.is_admin;
      if (userId !== true) {
        return ctx.unauthorized("unauthorized access");
      }
      const counts = await strapi
        .service("api::user-profile.user-profile")
        .getCountOfUsers();
      return ctx.send({
        data: { counts: counts },
      });
    } catch (error) {
      throw error;
    }
  },
  getUserProfile: async (ctx) => {
    try {
      const userId = ctx.state.user.is_admin;
      if (userId !== true) {
        return ctx.unauthorized("unauthorized access");
      }
      const userProfile = await strapi
        .service("api::user-profile.user-profile")
        .getUserProfile(ctx.params.id);
      return ctx.send({
        data: { userProfile: userProfile },
      });
    } catch (error) {
      throw error;
    }
  },
  usersCompletedProfile: async (ctx) => {
    try {
      const userId = ctx.state.user.is_admin;
      if (userId !== true) {
        return ctx.unauthorized("unauthorized access");
      }
      const userProfile = await strapi
        .service("api::user-profile.user-profile")
        .usersCompletedProfile();
      return ctx.send({
        data: { userProfile: userProfile },
      });
    } catch (error) {
      throw error;
    }
  },
  usersAssessments : async (ctx) => {
    try {
      const userId = ctx.state.user.is_admin;
      if (userId !== true) {
        return ctx.unauthorized("unauthorized access");
      }
      const usersAssessments = await strapi
        .service("api::user-profile.user-profile")
        .usersAssessments();
      return ctx.send({
        data: { usersAssessments },
      });
    } catch (error) {
      throw error;
    }
  },
  getUserAssessments : async (ctx) => {
    try {
      const userId = ctx.state.user.is_admin;
      if (userId !== true) {
        return ctx.unauthorized("unauthorized access");
      }
      const userAssessment = await strapi
        .service("api::user-profile.user-profile")
        .getUserAssessments(ctx);
      return ctx.send({
        data: { userAssessment },
      });
    } catch (error) {
      throw error;
    }
  },
});
