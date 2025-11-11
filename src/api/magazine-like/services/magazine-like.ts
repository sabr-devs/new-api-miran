/**
 * magazine-like service
 */

import { factories } from '@strapi/strapi';
const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

function removeItemById(arr, idToRemove) {
  const newArray = arr.filter(item => item.id !== idToRemove);
  return newArray;
}

function isIdFound(arr, idToFind) {
  return arr?.some(item => item.id === idToFind);
}

export default factories.createCoreService('api::magazine-like.magazine-like', ({ strapi }) => ({
  findAllMagazineLikes: async (magazineIssue) => {
    const likes = await strapi.documents('api::magazine-like.magazine-like').findMany({
      filters: {
        $and: [{ magazine: magazineIssue }],
      },
      populate: {
        users: {
          fields: ['id', 'username']
        }
      }
    });

    if (likes && likes.length > 0) {
      return likes[0];
    }
    return null;
  },

  likeForUser: async (userId, magazine) => {
    try {
      if (magazine?.id) {
        const prevMagazineLikes = await strapi
          .service("api::magazine-like.magazine-like")
          .findAllMagazineLikes(magazine?.id);
        
        if (prevMagazineLikes?.documentId) {
          const isUserFound = isIdFound(prevMagazineLikes?.users, userId);
          
          if (isUserFound) {
            // Remove user - disconnect relation
            const usersToKeep = prevMagazineLikes.users
              .filter(user => user.id !== userId)
              .map(user => user.id);
            
            const updatedMagazineLikes = await strapi.documents('api::magazine-like.magazine-like').update({
              documentId: prevMagazineLikes.documentId,
              data: {
                users: {
                  set: usersToKeep // Use 'set' to replace all relations
                }
              }
            });
            return false;
          } else {
            // Add user - connect relation
            const updatedMagazineLikes = await strapi.documents('api::magazine-like.magazine-like').update({
              documentId: prevMagazineLikes.documentId,
              data: {
                users: {
                  connect: [userId] // Use 'connect' to add new relations
                }
              }
            });
            return true;
          }
        } else {
          // Create new magazine like
          const newMagazineLike = await strapi.documents('api::magazine-like.magazine-like').create({
            data: {
              magazine: magazine.id,
              users: {
                connect: [userId] // Use 'connect' for initial relations
              },
              date: new Date()
            },
          });
          return newMagazineLike;
        }
      }
      throw new ApplicationError("no such magazine");
    } catch (error) {
      throw error;
    }
  },

  getUserLikeStatus: async (userId, magazine) => {
    try {
      if (magazine) {
        const prevMagazineLikes = await strapi
          .service("api::magazine-like.magazine-like")
          .findAllMagazineLikes(magazine);
        
        if (prevMagazineLikes && prevMagazineLikes?.users?.length) {
          const isUserFound = isIdFound(prevMagazineLikes?.users, userId);
          if (isUserFound) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
      throw new ApplicationError("no such magazine");
    } catch (error) {
      throw error;
    }
  }
}));