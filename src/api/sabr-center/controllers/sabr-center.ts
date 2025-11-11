module.exports = ({strapi}) => ({
  getAllUsers : async (ctx) => {
    try {
      const users = await strapi
        .service("api::sabr-center.sabr-center")
        .getAllUsers();
      ctx.send(users);
    } catch (err) {
      console.log(err);
    }
  }
})
