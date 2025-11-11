module.exports ={
  routes: [
    {
      method: "GET",
      path: "/tool-evidence/getAllTools",
      handler: "tool-evidence.getAllTools",
    },
    {
      method: "GET",
      path: "/tool-evidence/getSingleTool/:slug",
      handler: "tool-evidence.getSingleTool",
    },
    {
      method: "GET",
      path: "/tool-evidence/getToolIssuePdf/:slug",
      handler: "tool-evidence.getToolIssuePdf",
    },
    {
      method: "GET",
      path: "/tool-evidence/getAllEvidence",
      handler: "tool-evidence.getAllEvidence",
    },
    {
      method: "GET",
      path: "/tool-evidence/getSingleEvidence/:slug",
      handler: "tool-evidence.getSingleEvidence",
    },
    {
      method: "GET",
      path: "/tool-evidence/getEvidencePdf/:slug",
      handler: "tool-evidence.getEvidencePdf",
    }
  ],
}
