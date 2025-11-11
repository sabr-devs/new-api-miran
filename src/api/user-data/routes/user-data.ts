module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-data/get",
      handler: "user-data.getUserData",
    },
    {
      method: "POST",
      path: "/user-data/save",
      handler: "user-data.save",
    },
    {
      method: "GET",
      path: "/user-data/getEmailForControl/:email",
      handler: "user-data.getEmailForControl",
    },
    {
      method: "PUT",
      path: "/user-data/failLoginAttempts",
      handler: "user-data.failLoginAttempts",
    },
    {
      method: "GET",
      path: "/user-data/getUserBookmarks",
      handler: "user-data.getUserBookmarks",
    },
    {
      method: "POST",
      path: "/user-data/deleteBookmark",
      handler: "user-data.deleteBookmark",
    },
    {
      method: "POST",
      path: "/user-data/addBookmark",
      handler: "user-data.addBookmark",
    },
    {
      method: "POST",
      path: "/user-data/getBookmarkStatus",
      handler: "user-data.getBookmarkStatus",
    },
    {
      method: "GET",
      path: "/user-data/efficacy-assessment",
      handler: "user-data.getUserEfficiencyAssessment",
    },
    {
      method: "GET",
      path: "/user-data/efficacy-assessment-questions",
      handler: "user-data.getEfficacyAssessmentQuestions",
    },
    {
      method: "POST",
      path: "/user-data/efficacy-assessment",
      handler: "user-data.saveUserEfficacyAssessment",
    },
  ],
};
