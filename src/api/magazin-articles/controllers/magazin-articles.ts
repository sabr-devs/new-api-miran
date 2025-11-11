module.exports = ({ strapi }) => ({
  getArticle: async (ctx) => {
    try {
      const slug = ctx.request.params.slug;
      const userId=ctx.state.user.id
      const articles = await strapi
        .service("api::article.article")
        .getArticle(userId,slug);
      return ctx.send({
        data: { articles: articles },
      });
    } catch (error) {
      throw error;
    }
  }
});
