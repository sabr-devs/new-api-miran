module.exports = {
  routes: [
    {
      method:"GET",
      path:"/magazin-articles/getArticle/:slug",
      handler:"magazin-articles.getArticle"
    }
  ]
}
