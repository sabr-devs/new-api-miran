module.exports = ({ strapi }) => ({
  // User Profile Handlers
  getMyProfile: async (ctx) => {
    try {
      const userProfile = await strapi
        .service("api::user-profile.user-profile")
        .getMyProfile(ctx);
      return ctx.send(userProfile);
    } catch (error) {
      throw error;
    }
  },
  updateMyProfile: async (ctx) => {
    try {
      const updatedProfile = await strapi
        .service("api::user-profile.user-profile")
        .updateMyProfile(ctx);
      return ctx.send(updatedProfile);
    } catch (error) {
      throw error;
    }
  },

  // Miran Magazine Handlers
  getMiranMagazine: async (ctx) => {
    try {
      const magazines = await strapi
        .service("api::main-magazine.main-magazine")
        .getMiranMagazine(ctx);
      return ctx.send(magazines);
    } catch (error) {
      throw error;
    }
  },
  getMiranMagazineBySlug: async (ctx) => {
    try {
      const magazine = await strapi
        .service("api::main-magazine.main-magazine")
        .getMiranMagazineBySlug(ctx);
      return ctx.send(magazine);
    } catch (error) {
      throw error;
    }
  },
  // Miran Tool Handlers
  getMiranTools: async (ctx) => {
    try {
      const tools = await strapi
        .service("api::miran-tool.miran-tool")
        .getMiranTools(ctx);
      return ctx.send(tools);
    } catch (error) {
      throw error;
    }
  },
  getMiranToolBySlug: async (ctx) => {
    try {
      const tool = await strapi
        .service("api::miran-tool.miran-tool")
        .getMiranToolBySlug(ctx);
      return ctx.send(tool);
    } catch (error) {
      throw error;
    }
  },
  // Evidence Tool Handlers
  getMiranEvidences: async (ctx) => {
    try {
      const evidences = await strapi
        .service("api::miran-evidence.miran-evidence")
        .getMiranEvidences(ctx);
      return ctx.send(evidences);
    } catch (error) {
      throw error;
    }
  },
  getMiranEvidenceBySlug: async (ctx) => {
    try {
      const evidence = await strapi
        .service("api::miran-evidence.miran-evidence")
        .getMiranEvidenceBySlug(ctx);
      return ctx.send(evidence);
    } catch (error) {
      throw error;
    }
  },
  // Miran Evidence webinar Handlers
  getMiranWebinars: async (ctx) => {
    try {
      const webinars = await strapi
        .service("api::webinar.webinar")
        .getMiranWebinars(ctx);
      return ctx.send(webinars);
    } catch (error) {
      throw error;
    }
  },
  getMiranWebinarByID: async (ctx) => {
    try {
      const webinar = await strapi
        .service("api::webinar.webinar")
        .getMiranWebinarByID(ctx);
      return ctx.send(webinar);
    } catch (error) {
      throw error;
    }
  },
  getUpcomingWebinars: async (ctx) => {
    try {
      const webinars = await strapi
        .service("api::webinar.webinar")
        .getUpcomingWebinars(ctx);
      return ctx.send(webinars);
    } catch (error) {
      throw error;
    }
  },
  // Miran Advisory-board Handlers
  getMiranAdvisoryBoards: async (ctx) => {
    try {
      const advisoryBoards = await strapi
        .service("api::advisory-jury.advisory-jury")
        .getMiranAdvisoryBoards(ctx);
      return ctx.send(advisoryBoards);
    } catch (error) {
      throw error;
    }
  },
  // Pdf File
  updateDownloadCount: async (ctx) => {
    try {
      // console.log("updateDownloadCount", id);
      const updatedFile = await strapi
        .service("api::pdf-file.pdf-file")
        .updateDownloadCount(ctx);
      return ctx.send(updatedFile);
    } catch (error) {
      return ctx.throw(400, error);
    }
  },

  // User Likes Handlers
  fetchLikeStatus: async (ctx) => {
    try {
      const likeStatus = await strapi
        .service("api::miran-api.miran-api")
        .fetchLikeStatus(ctx);
      return ctx.send(likeStatus);
    } catch (error) {
      throw error;
    }
  },
  toggleUserLike: async (ctx) => {
    try {
      const result = await strapi
        .service("api::miran-api.miran-api")
        .toggleUserLike(ctx);
      return ctx.send(result);
    } catch (error) {
      throw error;
    }
  },
  // User Bookmarks Handlers
  fetchUserBookmarks: async (ctx) => {
    try {
      const bookmarkStatus = await strapi
        .service("api::user-book-mark.user-book-mark")
        .fetchUserBookmarks(ctx);
      return ctx.send(bookmarkStatus);
    } catch (error) {
      throw error;
    }
  },
  fetchBookmarkStatus: async (ctx) => {
    try {
      const newBookmark = await strapi
        .service("api::user-book-mark.user-book-mark")
        .fetchBookmarkStatus(ctx);
      return ctx.send(newBookmark);
    } catch (error) {
      throw error;
    }
  },
  addBookmark: async (ctx) => {
    try {
      const updatedBookmarks = await strapi
        .service("api::user-book-mark.user-book-mark")
        .addBookmark(ctx);
      return ctx.send(updatedBookmarks);
    } catch (error) {
      throw error;
    }
  },
  deleteUserBookmark: async (ctx) => {
    try {
      const updatedBookmarks = await strapi
        .service("api::user-book-mark.user-book-mark")
        .deleteUserBookmark(ctx);
      return ctx.send(updatedBookmarks);
    } catch (error) {
      throw error;
    }
  },
});
