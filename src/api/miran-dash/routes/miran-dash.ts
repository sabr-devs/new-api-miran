module.exports ={
  routes:[
    {
      method: "GET",
      path: "/miran-dash/getCountOfUsers",
      handler: "miran-dash.getCountOfUsers",
    },
    {
      method: "GET",
      path: "/miran-dash/getUserProfile/:id",
      handler: "miran-dash.getUserProfile",
    },
    {
      method: "GET",
      path: "/miran-dash/users-completed-profile",
      handler: "miran-dash.usersCompletedProfile",
    },
    {
      method: "GET",
      path: "/miran-dash/users-assessments",
      handler: "miran-dash.usersAssessments",
    },
    {
      method: "GET",
      path: "/miran-dash/users-assessment/:id",
      handler: "miran-dash.getUserAssessments",
    },
  ],
}
