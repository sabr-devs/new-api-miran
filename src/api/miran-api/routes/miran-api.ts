module.exports = {
  routes: [
    // User Profile Routes
    {
      method: "GET",
      path: "/miran-api/user-profile",
      handler: "miran-api.getMyProfile",
    },
    {
      method: "POST",
      path: "/miran-api/user-profile",
      handler: "miran-api.updateMyProfile",
    },
    // Miran Magazine Routes
    {
      method: "GET",
      path: "/miran-api/miran-magazine",
      handler: "miran-api.getMiranMagazine",
    },
    {
      method: "GET",
      path: "/miran-api/miran-magazine/:slug",
      handler: "miran-api.getMiranMagazineBySlug",
    },
    // Miran Tool Routes
    {
      method: "GET",
      path: "/miran-api/miran-tools",
      handler: "miran-api.getMiranTools",
    },
    {
      method: "GET",
      path: "/miran-api/miran-tools/:slug",
      handler: "miran-api.getMiranToolBySlug",
    },
    // Miran Evidence Routes
    {
      method: "GET",
      path: "/miran-api/miran-evidence",
      handler: "miran-api.getMiranEvidences",
    },
    {
      method: "GET",
      path: "/miran-api/miran-evidence/:slug",
      handler: "miran-api.getMiranEvidenceBySlug",
    },
    // Miran Evidence webinar Routes
    {
      method: "GET",
      path: "/miran-api/webinars",
      handler: "miran-api.getMiranWebinars",
    },
    {
      method: "GET",
      path: "/miran-api/upcoming-webinars",
      handler: "miran-api.getUpcomingWebinars",
    },
    {
      method: "GET",
      path: "/miran-api/webinars/:id",
      handler: "miran-api.getMiranWebinarByID",
    },
    // Miran Advisory-board Routes
    {
      method: "GET",
      path: "/miran-api/advisory-board",
      handler: "miran-api.getMiranAdvisoryBoards",
    },
    // Pdf Download Route
    {
      method: "PUT",
      path: "/miran-api/files/:id",
      handler: "miran-api.updateDownloadCount",
    },

    // User Likes Routes
    {
      method: "GET",
      path: "/miran-api/likes/:contentType/:id",
      handler: "miran-api.fetchLikeStatus",
    },
    {
      method: "POST",
      path: "/miran-api/likes/:contentType/:id",
      handler: "miran-api.toggleUserLike",
    },
    // User Bookmarks Routes
    {
      method: "GET",
      path: "/miran-api/user-bookmarks",
      handler: "miran-api.fetchUserBookmarks",
    },
    {
      method: "GET",
      path: "/miran-api/user-bookmark-status",
      handler: "miran-api.fetchBookmarkStatus",
    },
    {
      method: "POST",
      path: "/miran-api/user-bookmarks",
      handler: "miran-api.addBookmark",
    },
    {
      method: "DELETE",
      path: "/miran-api/user-bookmarks/:id",
      handler: "miran-api.deleteUserBookmark",
    },
  ],
};
