/**
 * user-book-mark service
 */

import { factories } from "@strapi/strapi";
function removeItemById(arr, idToRemove) {
  // Convert idToRemove to number for proper comparison
  const id = Number(idToRemove);
  // console.log('arr', arr);
  // console.log("idToRemove", idToRemove, "as number:", id);

  const newArray = arr.filter((item) => item.id !== id);
  // console.log('newArray', newArray);
  return newArray;
}
function isUrlFound(arr, urlToFind) {
  // Use Array.prototype.some to check if any item has the specified id
  return arr?.some((item) => item.url === urlToFind);
}
function removeItemByUrl(arr, url) {
  // Use Array.prototype.filter to create a new array without the item with the specified id
  const newArray = arr.filter((item) => item.url !== url);
  return newArray;
}
export default factories.createCoreService(
  "api::user-book-mark.user-book-mark",
  ({ strapi }) => ({
    // New Service Method
    fetchUserBookmarks: async (ctx) => {
      const userId = ctx.state.user.id;
      try {
        const userBookmarks = await strapi
          .documents("api::user-book-mark.user-book-mark")
          .findMany({
            filters: { user: { id: userId } },
            populate: ["bookmarks"],
          });
        return {
          success: true,
          data: userBookmarks,
        };
      } catch (error) {
        throw error;
      }
    },
    deleteUserBookmark: async (ctx) => {
      const bookmarkId = ctx.params.id;
      const userId = ctx.state.user.id;
      // console.log("bookmarkId", bookmarkId);
      try {
        const userBookmark = await strapi
          .documents("api::user-book-mark.user-book-mark")
          .findMany({
            filters: { user: { id: userId } },
            populate: ["bookmarks"],
          });
        // console.log("userBookmark", userBookmark);
        if (userBookmark && userBookmark.length > 0) {
          const updatedBookmarks = removeItemById(
            userBookmark[0]?.bookmarks,
            bookmarkId
          );
          // console.log("updatedBookmarks", updatedBookmarks);
          await strapi.documents("api::user-book-mark.user-book-mark").update({
            documentId: userBookmark[0]?.documentId,
            data: { bookmarks: updatedBookmarks },
          });
          return {
            success: true,
            data: updatedBookmarks,
          };
        }
        return { success: false, message: "not found" };
      } catch (error) {
        throw error;
      }
    },
    fetchBookmarkStatus: async (ctx) => {
      try {
        const { url } = ctx.query;
        const userId = ctx.state.user.id;
        console.log("bookmarkUrl", url);
        const userBookmark = await strapi
          .documents("api::user-book-mark.user-book-mark")
          .findMany({
            filters: { user: { id: userId } },
            populate: ["bookmarks"],
          });
        // console.log("userBookmark", userBookmark);
        if (userBookmark && userBookmark.length > 0) {
          const status = isUrlFound(userBookmark[0]?.bookmarks, url);
          return {
            success: true,
            data: {
              bookmarkStatus: status,
              bookmarkId: status
                ? userBookmark[0]?.bookmarks.find((item) => item.url === url)
                    ?.id
                : null,
            },
          };
        }
        return { success: false, message: "not found" };
      } catch (error) {
        throw error;
      }
    },
    addBookmark: async (ctx) => {
      try {
        const userId = ctx.state.user.id;
        const bookmark = ctx.request.body;
        const userBookmarkRecord = await strapi
          .documents("api::user-book-mark.user-book-mark")
          .findMany({
            filters: { user: { id: userId } },
            populate: ["bookmarks"],
          });
        // console.log("userBookmark", userBookmark);
        if (userBookmarkRecord && userBookmarkRecord.length > 0) {
          const updatedBookmarks = [
            ...userBookmarkRecord[0]?.bookmarks,
            bookmark,
          ];
          await strapi.documents("api::user-book-mark.user-book-mark").update({
            documentId: userBookmarkRecord[0]?.documentId,
            data: { bookmarks: updatedBookmarks },
          });
          return {
            success: true,
            data: {
              bookmarkStatus: true,
              bookmarkId: userBookmarkRecord[0]?.bookmarks.find(
                (item) => item.url === bookmark.url
              )?.id,
            },
          };
        }
        const newUserBookmarkRecord = await strapi
          .documents("api::user-book-mark.user-book-mark")
          .create({
            data: {
              user: userId,
              bookmarks: [bookmark],
            },
            populate: ["bookmarks"],
          });
        if (newUserBookmarkRecord) {
          return {
            success: true,
            data: {
              bookmarkStatus: true,
              bookmarkId: newUserBookmarkRecord?.bookmarks.find(
                (item) => item.url === bookmark.url
              )?.id,
            },
          };
        }
        return { success: false, message: "not found" };
      } catch (error) {
        throw error;
      }
    },
  })
);
