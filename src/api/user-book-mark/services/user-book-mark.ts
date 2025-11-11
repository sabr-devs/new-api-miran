/**
 * user-book-mark service
 */

import { factories } from "@strapi/strapi";
function removeItemById(arr, idToRemove) {
  // Use Array.prototype.filter to create a new array without the item with the specified id
  const newArray = arr.filter((item) => item.id !== idToRemove);
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
    async getUserBookmarks(userId) {
      return await strapi.entityService.findMany(
        "api::user-book-mark.user-book-mark",
        {
          filters: {
            user: {
              id: userId,
            },
          },
          populate: {
            bookmarks: {
              fields: ["url", "title"],
            },
          },
        }
      );
    },
    async deleteBookmark(userId, bookmarkId) {
      const userBookmark = await strapi
        .service("api::user-book-mark.user-book-mark")
        .getUserBookmarks(userId);
      console.log(userBookmark[0]?.bookmarks, bookmarkId);
      if (userBookmark && userBookmark.length > 0) {
        const updatedBookmarks = removeItemById(
          userBookmark[0]?.bookmarks,
          bookmarkId
        );
        console.log(updatedBookmarks);
        await strapi.entityService.update(
          "api::user-book-mark.user-book-mark",
          userBookmark[0]?.id,
          {
            data: {
              bookmarks: updatedBookmarks,
            },
          }
        );
        return updatedBookmarks;
      } else {
        return "not found";
      }
    },
    async addBookmark(userId, bookmark) {
      const userBookmark = await strapi
        .service("api::user-book-mark.user-book-mark")
        .getUserBookmarks(userId);
      if (userBookmark?.length === 0) {
        const newBookmark = await strapi.entityService.create(
          "api::user-book-mark.user-book-mark",
          {
            data: {
              user: {
                id: userId,
              },
              bookmarks: [bookmark],
            },
          }
        );
        return newBookmark;
      } else {
        const oldBookmarks = userBookmark[0]?.bookmarks;
        // console.log(oldBookmarks)
        if (!isUrlFound(oldBookmarks, bookmark.url)) {
          oldBookmarks.push(bookmark);
          await strapi.entityService.update(
            "api::user-book-mark.user-book-mark",
            userBookmark[0]?.id,
            {
              data: {
                bookmarks: oldBookmarks,
              },
            }
          );
          return oldBookmarks;
        } else {
          const updatedBookmarks = removeItemByUrl(oldBookmarks, bookmark.url);
          await strapi.entityService.update(
            "api::user-book-mark.user-book-mark",
            userBookmark[0]?.id,
            {
              data: {
                bookmarks: updatedBookmarks,
              },
            }
          );
          return updatedBookmarks;
        }
      }
    },
    async getBookmarkStatus(userId, bookmark) {
      const userBookmark = await strapi
        .service("api::user-book-mark.user-book-mark")
        .getUserBookmarks(userId);
      // console.log(userBookmark, bookmark?.url)
      if (userBookmark?.length === 0) {
        return false;
      } else {
        const oldBookmarks = userBookmark[0]?.bookmarks;
        if (!isUrlFound(oldBookmarks, bookmark.url)) {
          return false;
        } else {
          return true;
        }
      }
    },
  })
);
