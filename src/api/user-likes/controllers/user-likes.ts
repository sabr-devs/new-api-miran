module.exports = ({ strapi }) => ({
  getMagazineLikes: async (ctx) => {
    try {
      const magazineIssue = ctx.request.params.id;;
      const magazinesLike = await strapi
        .service("api::magazine-like.magazine-like")
        .findAllMagazineLikes(magazineIssue);
      return ctx.send({
        data: { magazinesLikes: magazinesLike },
      });
    } catch (error) {
      throw error;
    }
  },
 like: async (ctx) => {
    try {
      const magazine = ctx.request.body;
      if (magazine) {
        const savedLike = await strapi
          .service("api::magazine-like.magazine-like")
          .likeForUser(ctx.state.user.id, magazine);
        return ctx.send({
          data: { savedLike: savedLike },
        });
      }
      return ctx.badRequest("no Magazine submitted");
    } catch (error) {
      throw error;
    }
  },
  getUserLikeStatus: async (ctx) => {
    try {
      const magazine = ctx.request.params.id;
      if (magazine) {
        const userLikes = await strapi
          .service("api::magazine-like.magazine-like")
          .getUserLikeStatus(ctx.state.user.id, magazine);
        return ctx.send({
          data: { userLikes: userLikes },
        });
      }
      return ctx.badRequest("no Magazine submitted");
    } catch (error) {
      throw error;
    }
  }

  // getOne: async (ctx) => {
  //   const projectId = ctx.request.params.id;
  //   if (projectId) {
  //     const user = ctx.state.user;
  //     const userProject = await strapi
  //       .service("api::project.project")
  //       .findOneByUser(user.id, projectId);
  //     if (userProject) {
  //       return ctx.send({
  //         data: { project: userProject },
  //       });
  //     }
  //     return ctx.notFound("no such project");
  //   }
  //   return ctx.badRequest("no project id");
  // },

});
