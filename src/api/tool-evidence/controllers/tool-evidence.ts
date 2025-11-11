module.exports = ({ strapi }) => ({
  getAllTools: async (ctx) => {
    try {
      const miranTools = await strapi
        .service("api::miran-tool.miran-tool")
        .getAllTools();
      return ctx.send({
        data: { miranTools: miranTools },
      });
    } catch (error) {
      throw error;
    }
  },
  getSingleTool: async (ctx) => {
    try {
      const slug = ctx.request.params.slug;
      // console.log(slug);
      const miranTool = await strapi
        .service("api::miran-tool.miran-tool")
        .getSingleTool(slug);
      return ctx.send({
        data: { miranTool: miranTool },
      });
    } catch (error) {
      throw error;
    }
  },
  getToolIssuePdf: async (ctx) => {
    try {
      const slug = ctx.request.params.slug;
      const userId = ctx.state.user.id
      // console.log(slug);
      const toolPdf = await strapi
        .service("api::miran-tool.miran-tool")
        .getToolIssuePdf(userId,slug);
      return ctx.send({
        data: { toolPdf: toolPdf },
      });
    } catch (error) {
      throw error;
    }
  },
  getAllEvidence: async (ctx) => {
    try {
      const miranEvidences = await strapi
        .service("api::miran-evidence.miran-evidence")
        .getAllEvidence();
      return ctx.send({
        data: { miranEvidences: miranEvidences },
      });
    } catch (error) {
      throw error;
    }
  },
  getSingleEvidence: async (ctx) => {
    try {
      const slug = ctx.request.params.slug;
      // console.log(slug);
      const miranEvidence = await strapi
        .service("api::miran-evidence.miran-evidence")
        .getSingleEvidence(slug);
      return ctx.send({
        data: { miranEvidence: miranEvidence },
      });
    } catch (error) {
      throw error;
    }
  },
  getEvidencePdf: async (ctx) => {
    try {
      const slug = ctx.request.params.slug;
      const userId = ctx.state.user.id
      // console.log(slug);
      const evidencePdf = await strapi
        .service("api::miran-evidence.miran-evidence")
        .getEvidencePdf(userId,slug);
      return ctx.send({
        data: { evidencePdf: evidencePdf },
      });
    } catch (error) {
      throw error;
    }
  },
})
