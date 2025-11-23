/**
 * user-profile service
 */

import { factories } from "@strapi/strapi";
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

// --- Helper function for validation

const checkProfileCompletion = (profileData, incomingUpdate) => {
  // Merge existing data with the incoming update for the complete picture
  // The incomingUpdate object contains the key being updated (e.g., { basic_info: {...} })
  const data = {
    ...profileData,
    ...incomingUpdate,
  };

  // 1. Basic Info Validation
  const isBasicInfoComplete =
    data.basic_info?.fullname?.trim() &&
    data.basic_info?.age &&
    data.basic_info?.study &&
    data.basic_info?.marital;

  // 2. Contact Info Validation
  const isContactInfoComplete =
    data.contact_information?.address?.trim() &&
    data.contact_information?.city &&
    data.contact_information?.number?.trim();

  // 3. Work Experience Validation
  let isWorkExperienceComplete = false;
  const experiences = data.work_experience?.experience || [];
  if (experiences.length > 0) {
    // Check if at least one experience entry is fully valid
    const validExperiences = experiences.filter(
      (exp) =>
        exp.fieldOfWork?.trim() &&
        exp.workplace?.trim() &&
        exp.YearsOfExperience.trim() &&
        exp.ageGroup?.trim()
    );
    if (validExperiences.length > 0) {
      isWorkExperienceComplete = true;
    }
  }

  // 4. Tasks Activities Validation (Checking for languages array length)
  const isTasksActivitiesComplete =
    data.tasks_activities?.languages?.length > 0;

  // Profile is complete only if ALL sections are complete
  return (
    isBasicInfoComplete &&
    isContactInfoComplete &&
    isWorkExperienceComplete &&
    isTasksActivitiesComplete
  );
};
export default factories.createCoreService(
  "api::user-profile.user-profile",
  ({ strapi }) => ({
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
    usersAssessments: async () => {
      const assessments = await strapi.entityService.findMany(
        "api::efficacy-assessment.efficacy-assessment",
        {
          populate: {
            user: {
              fields: ["email", "fullname"],
            },
          },
          sort: ["updatedAt:desc"],
        }
      );
      return assessments;
    },
    getUserAssessments: async (ctx) => {
      console.log(ctx.params.id);
      const assessments = await strapi.entityService.findMany(
        "api::efficacy-assessment.efficacy-assessment",
        {
          populate: {
            user: {
              fields: ["email", "fullname", "createdAt"],
            },
          },
          filters: {
            id: ctx.params.id,
          },
        }
      );
      return assessments;
    },
    // New services Start Here
    getMyProfile: async (ctx) => {
      try {
        const userProfile = await strapi
          .documents("api::user-profile.user-profile")
          .findMany({
            filters: { user: ctx.state.user.id },
          });
        // console.log("userProfile", userProfile);
        if (!userProfile || !userProfile.length) {
          const newProfile = await strapi
            .documents("api::user-profile.user-profile")
            .create({
              data: {
                user: ctx.state.user.id,
                contact_information: {
                  email: ctx.state.user.email,
                },
              },
            });
          return {
            success: true,
            data: newProfile,
          };
        }
        return {
          success: true,
          data: userProfile[0],
        };
      } catch (error) {
        throw error;
      }
    },
    updateMyProfile: async (ctx) => {
      try {
        const userId = ctx.state.user.id;
        const incomingData = ctx.request.body;

        // 1. Find the existing user profile
        const userProfiles = await strapi
          .documents("api::user-profile.user-profile")
          .findMany({
            filters: { user: userId },
          });

        if (!userProfiles || userProfiles.length === 0) {
          return {
            success: false,
            message: "User profile not found",
          };
        }

        const currentProfile = userProfiles[0];
        const profileDocumentId = currentProfile.documentId;
        const currentProfileStatus = currentProfile.profile_status || false;

        // 2. Check for completion *after* applying the incoming update
        const updatedProfileDataForCheck = {
          basic_info: currentProfile.basic_info,
          contact_information: currentProfile.contact_information,
          work_experience: currentProfile.work_experience,
          tasks_activities: currentProfile.tasks_activities,
          ...incomingData, // Overwrite with the fields being updated
        };

        const isProfileComplete = checkProfileCompletion(
          updatedProfileDataForCheck,
          {}
        );

        // 3. Determine the final profile_status to save
        let newProfileStatus = currentProfileStatus;

        if (isProfileComplete && !currentProfileStatus) {
          // Profile is now complete and was previously incomplete
          newProfileStatus = true;
          // Add profile_status to the incoming data for the update call
          incomingData.profile_status = newProfileStatus;
        }

        // Ensure profile_status is not accidentally set to false if it was true and validation is met
        if (currentProfileStatus && isProfileComplete) {
          incomingData.profile_status = true;
        }

        // 4. Update the User Profile document
        const updatedProfile = await strapi
          .documents("api::user-profile.user-profile")
          .update({
            documentId: profileDocumentId,
            data: incomingData,
          });

        // 5. Update the core Strapi User table if the status changed to true
        if (newProfileStatus && !currentProfileStatus) {
          await strapi.query("plugin::users-permissions.user").update({
            where: { id: userId },
            data: { profile_status: true },
          });
          console.log(
            `User ${userId} profile_status updated to true in core user table.`
          );
        }

        // 6. Return the updated profile data (including the new profile_status)
        return {
          success: true,
          // Attach the final status to the returned data for the NextAuth client check
          data: {
            ...updatedProfile,
            profile_status: newProfileStatus, // Ensure the status is explicitly returned
          },
        };
      } catch (error) {
        console.error("Error in updateMyProfile:", error);
        return {
          success: false,
          message: "An internal error occurred during profile update.",
          error: error.message,
        };
      }
    },
  })
);
