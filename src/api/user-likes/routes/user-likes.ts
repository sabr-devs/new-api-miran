module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-likes/get/:id",
      handler: "user-likes.getMagazineLikes",
    },
    {
      method: "POST",
      path: "/user-likes/like",
      handler: "user-likes.like",
    },
    {
      method: "GET",
      path: "/user-likes/getuserlikestatus/:id",
      handler: "user-likes.getUserLikeStatus",
    },
    // {
    //   method: "POST",
    //   path: "/user-likes/save",
    //   handler: "user-likes.save",
    // },
  ],
};
