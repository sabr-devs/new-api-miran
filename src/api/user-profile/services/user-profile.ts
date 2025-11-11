/**
 * user-profile service
 */

import { factories } from '@strapi/strapi';
const getConfirmed = (users) => {
  return users.filter((user) => user.confirmed);
};
const getNotConfirmed = (users) => {
  return users.filter((user) => !user.confirmed);
};
const getCompleteProfile = (users) => {
  return users.filter((user) => user?.user_profile?.status);
};
const getIncompleteProfile = (users) => {
  return users.filter((user) => !user?.user_profile?.status && user?.confirmed);
};
const getTodaysConfirmedRegisteredUsers = (users) => {
  return users.filter(
    (user) =>
      user?.createdAt?.split("T")[0] ===
        new Date().toISOString().split("T")[0] && user?.confirmed
  );
};
const getTodaysNotConfirmedRegisteredUsers = (users) => {
  return users.filter(
    (user) =>
      user?.createdAt?.split("T")[0] ===
        new Date().toISOString().split("T")[0] && !user?.confirmed
  );
};
export default factories.createCoreService('api::user-profile.user-profile', ({ strapi }) => ({
        findOneByUser: async (userId) => {
      // console.log(userId)
      const profil = await strapi.entityService.findMany(
        "api::user-profile.user-profile",
        {
          filters: {
            $and: [{ user: userId }],
          },
        }
      );
      // console.log(profil)
      if (profil) {
        return profil;
      }
      return null;
    },
    saveForUser: async (userId, userProfile) => {
      try {
        const prevProfile = await strapi
          .service("api::user-profile.user-profile")
          .findOneByUser(userId);
        if (prevProfile && prevProfile.length) {
          const updatedProfile = await strapi.entityService.update(
            "api::user-profile.user-profile",
            prevProfile[0].id,
            {
              data: userProfile,
            }
          );
          // console.log(updatedProfile)
          if (updatedProfile?.contact_information?.["number"]) {
            const updateUserPhone = await strapi.entityService.update(
              "plugin::users-permissions.user",
              userId,
              {
                data: {
                  phone_number: updatedProfile?.contact_information?.["number"],
                },
              }
            );
          }
          if (
            updatedProfile?.basic_info?.["age"] &&
            updatedProfile?.contact_information?.["number"] &&
            updatedProfile?.work_experience?.["experience"] &&
            updatedProfile?.tasks_activities?.["languages"]
          ) {
            const newProfile = { ...updatedProfile, status: true };
            const updatedProfileWithStatus = await strapi.entityService.update(
              "api::user-profile.user-profile",
              prevProfile[0].id,
              {
                data: newProfile,
              }
            );

            return updatedProfileWithStatus;
          } else {
            const newProfile = { ...updatedProfile, status: false };
            const updatedProfileWithStatus = await strapi.entityService.update(
              "api::user-profile.user-profile",
              prevProfile[0].id,
              {
                data: newProfile,
              }
            );
            return updatedProfileWithStatus;
          }
        } else {
          const newProfile = await strapi.entityService.create(
            "api::user-profile.user-profile",
            {
              data: {
                user: userId,
                ...userProfile,
              },
            }
          );
          return newProfile;
        }
      } catch (error) {
        throw error;
      }
    },
    getEmailForControl: async (email) => {
      //  console.log(email)
      // Example of custom function to either create or update a user based on some logic
      // const existingUser = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: email } });
      const existingUser = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          filters: {
            email: {
              $eq: email,
            },
          },
        }
      );
      if (existingUser[0]?.id) {
        // console.log(existingUser[0]?.id)
        // Update user logic
        return existingUser[0];
      } else {
        // Create new user logic
        // console.log('null')

        return null;
      }
    },
    failLoginAttempts: async (data) => {
      try {
        const { loginAttempts, lockoutUntil } = data;
        const updateUser = await strapi.entityService.update(
          "plugin::users-permissions.user",
          data.id,
          {
            data: {
              loginAttempts: loginAttempts,
              lockoutUntil: lockoutUntil,
            },
          }
        );
        return updateUser?.id;
      } catch (error) {
        throw error;
      }
    },
    getCountOfUsers: async () => {
      const existingUser = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          filters: {
            email: {
              $ne: null,
            },
          },
          fields: [
            "id",
            "email",
            "confirmed",
            "fullname",
            "createdAt",
            "phone_number",
          ],
          populate: {
            user_profile: true,
          },
          sort: ["createdAt:desc"],
        }
      );
      const usersInfo = {
        users: existingUser,
        count: existingUser.length,
        confirmdeUsersLength: getConfirmed(existingUser).length,
        confirmedUsers: getConfirmed(existingUser),
        notConfirmedUsersLength: getNotConfirmed(existingUser).length,
        notConfirmedUsers: getNotConfirmed(existingUser),
        completeProfileLength: getCompleteProfile(existingUser).length,
        completeProfile: getCompleteProfile(existingUser),
        incompleteProfileLength: getIncompleteProfile(existingUser).length,
        incompleteProfile: getIncompleteProfile(existingUser),
        todaysConfirmedRegisteredUsers:
          getTodaysConfirmedRegisteredUsers(existingUser),
        todaysConfirmedRegisteredUsersLength:
          getTodaysConfirmedRegisteredUsers(existingUser).length,
        todaysNotConfirmedRegisteredUsers:
          getTodaysNotConfirmedRegisteredUsers(existingUser),
        todaysNotConfirmedRegisteredUsersLength:
          getTodaysNotConfirmedRegisteredUsers(existingUser).length,
      };
      return usersInfo;
    },
    getUserProfile: async (id) => {
      const existingUser = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          filters: {
            id: {
              $eq: id,
            },
          },

          fields: [
            "email",
            "fullname",
            "phone_number",
            "confirmed",
            "createdAt",
          ],
          populate: {
            magazine_likes: {
              populate: {
                magazine: {
                  fields: ["title", "slug"],
                },
              },
            },
            user_profile: true,
            user_book_marks: {
              populate: {
                bookmarks: true,
              },
            },
          },
        }
      );
      if (existingUser[0]?.id) {
        return existingUser[0];
      } else {
        return null;
      }
    },
    usersCompletedProfile: async () => {
      const existingUser = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          filters: {
            email: {
              $ne: null,
            },
          },
          fields: ["id", "email", "confirmed", "fullname", "createdAt"],
          populate: {
            user_profile: true,
          },
          sort: ["updatedAt:desc"],
        }
      );
      const usersInfo = {
        users: getCompleteProfile(existingUser),
      };
      return usersInfo;
    },
    usersAssessments  : async () => {
      const assessments = await strapi.entityService.findMany(
        "api::efficacy-assessment.efficacy-assessment",
        {
          populate: {
            user: {
              fields : ['email','fullname'],
            },
          },
          sort: ['updatedAt:desc'],
        }
      );
      return assessments;
    },
    getUserAssessments : async (ctx) => {
      console.log(ctx.params.id)
      const assessments = await strapi.entityService.findMany(
        "api::efficacy-assessment.efficacy-assessment",
        {
          populate: {
            user: {
              fields : ['email','fullname','createdAt'],
            },
          },
          filters: {
            id:ctx.params.id,
          },
        }
      );
      return assessments;
    },
}));
