module.exports = ({ strapi }) => ({
  getUserData: async (ctx) => {
    const user = ctx.state.user;
    const userProfile = await strapi
      .service("api::user-profile.user-profile")
      .findOneByUser(user.id)
    if (userProfile) {
      return ctx.send({
        data: { userProfile: userProfile },
      })
    }
    return ctx.notFound("no such profile")
  },
  save: async (ctx) => {
    try {
      const userProfile = ctx.request.body;
      if (userProfile) {
        const savedProfile = await strapi
          .service("api::user-profile.user-profile")
          .saveForUser(ctx.state.user.id, userProfile)
        return ctx.send({
          data: { userProfile: savedProfile },
        })
      }
      return ctx.badRequest("no profile submitted");
    } catch (error) {
      throw error;
    }
  },
  getEmailForControl: async (ctx) => {
    const email = ctx.request.params.email;
    // console.log(email)
    try {
      const existingUser = await strapi
        .service("api::user-profile.user-profile")
        .getEmailForControl(email)
      return ctx.send({
          id: existingUser?.id,
          loginAttempts: existingUser?.loginAttempts,
          lockoutUntil: existingUser?.lockoutUntil
      })
    } catch (error) {
      return ctx.throw(400, error);
    }
  },
  failLoginAttempts: async (ctx) => {
    try {
      const userData = ctx.request.body;
      if (userData) {
        const newData = await strapi
          .service("api::user-profile.user-profile")
          .failLoginAttempts(userData)
        return ctx.send({
          data: { newData: newData },
        })
      }
      return ctx.badRequest("no Data submitted");
    } catch (error) {
      throw error;
    }
  },
  getUserBookmarks: async (ctx) => {
    try {
      const userId = ctx.state.user.id;
      const bookmarks = await strapi
        .service("api::user-book-mark.user-book-mark")
        .getUserBookmarks(userId);
      return ctx.send({
        data: { bookmarks: bookmarks },
      });
    } catch (error) {
      throw error;
    }
  },
  deleteBookmark: async (ctx) => {
    try {
      const userId = ctx.state.user.id;
      const bookmarkId = ctx.request.body.id;
      const bookmarks = await strapi
        .service("api::user-book-mark.user-book-mark")
        .deleteBookmark(userId, bookmarkId);
      return ctx.send({
        data: { bookmarks: bookmarks },
      });
    } catch (error) {
      throw error;
    }
  },
  addBookmark: async (ctx) => {
    try {
      const userId = ctx.state.user.id;
      const bookmark = ctx.request.body;
      const bookmarks = await strapi
        .service("api::user-book-mark.user-book-mark")
        .addBookmark(userId, bookmark);
      return ctx.send({
        data: { bookmarks: bookmarks },
      });
    } catch (error) {
      throw error;
    }
  },
  getBookmarkStatus: async (ctx) => {
    try {
      const userId = ctx.state.user.id;
      const bookmark = ctx.request.body;
      const bookmarkStatus = await strapi
        .service("api::user-book-mark.user-book-mark")
        .getBookmarkStatus(userId, bookmark);
      return ctx.send({
        data: { bookmarkStatus: bookmarkStatus },
      });
    } catch (error) {
      throw error;
    }
  },
  getUserEfficiencyAssessment : async (ctx) => {
    try {
      const userId = ctx.state.user.id;
      const efficiencyAssessment = await strapi
        .service("api::efficacy-assessment.efficacy-assessment")
        .getUserEfficiencyAssessment(userId);
      return ctx.send(efficiencyAssessment);
    } catch (error) {
      throw error;
    }
  },
  getEfficacyAssessmentQuestions : async (ctx) => {
    try {
      const questions = await strapi
        .service("api::efficacy-evaluation-question.efficacy-evaluation-question")
        .getEfficacyAssessmentQuestions();
      return ctx.send(questions);
    } catch (error) {
      throw error;
    }
  },
  saveUserEfficacyAssessment : async (ctx) => {
    try {

      const efficiencyAssessment = await strapi
        .service("api::efficacy-assessment.efficacy-assessment")
        .saveUserEfficacyAssessment(ctx);
      return ctx.send(efficiencyAssessment);
    } catch (error) {
      throw error;
    }
  },

})

