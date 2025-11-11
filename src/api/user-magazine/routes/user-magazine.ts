module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-magazine/get",
      handler: "user-magazine.getAllMagazinesForHome",
    },
    {
      method: "GET",
      path: "/user-magazine/getMagazinePage",
      handler: "user-magazine.getAllMagazinesForMagazinePage",
    },
    {
      method: "GET",
      path: "/user-magazine/getMagazineIssueInfo/:slug",
      handler: "user-magazine.getMagazineIssueInfo",
    },
    {
      method: "GET",
      path: "/user-magazine/getMagazineIssuePdf/:slug",
      handler: "user-magazine.getMagazineIssuePdf",
    },
    // {
    //   method: "POST",
    //   path: "/user-project/save",
    //   handler: "user-project.save",
    // },
  ],
};
