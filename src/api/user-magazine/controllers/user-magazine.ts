module.exports = ({ strapi }) => ({
  getAllMagazinesForHome: async (ctx) => {
    try {
      const magazinesHome = await strapi
        .service("api::main-magazine.main-magazine")
        .findAllMagazinesHero();
      return ctx.send({
        data: { magazinesHome: magazinesHome },
      });
    } catch (error) {
      throw error;
    }
  },
  getAllMagazinesForMagazinePage: async (ctx) => {
    try {
      const magazinesPage = await strapi
        .service("api::main-magazine.main-magazine")
        .findAllMagazineForMagazinePage();
      return ctx.send({
        data: { magazinesPage: magazinesPage },
      });
    } catch (error) {
      throw error;
    }
  },
  getMagazineIssueInfo: async (ctx) => {
    try {
      const slug = ctx.request.params.slug;
      console.log(slug);
      const magazine = await strapi
        .service("api::main-magazine.main-magazine")
        .getMagazineIssueInfo(slug);
      return ctx.send({
        data: { magazine: magazine },
      });
    } catch (error) {
      throw error;
    }
  },
  getMagazineIssuePdf: async (ctx) => {
    try {
      const slug = ctx.request.params.slug;
      const userId = ctx.state.user.id
      console.log(slug);
      const magazine = await strapi
        .service("api::main-magazine.main-magazine")
        .getMagazineIssuePdf(userId,slug);
      return ctx.send({
        data: { magazine: magazine },
      });
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
  // save: async (ctx) => {
  //   try {
  //     const project = ctx.request.body;
  //     if (project) {
  //       const savedProject = await strapi
  //         .service("api::project.project")
  //         .saveForUser(ctx.state.user.id, project);
  //       return ctx.send({
  //         data: { project: savedProject },
  //       });
  //     }
  //     return ctx.badRequest("no project submitted");
  //   } catch (error) {
  //     throw error;
  //   }
  // },
});
