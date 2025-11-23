const CONTENT_TYPES = {
  magazine: {
    contentApi: "api::main-magazine.main-magazine",
    likeApi: "api::magazine-like.magazine-like",
    relationField: "magazine",
  },
  tool: {
    contentApi: "api::miran-tool.miran-tool",
    likeApi: "api::tool-like.tool-like",
    relationField: "tool",
  },
  evidence: {
    contentApi: "api::miran-evidence.miran-evidence",
    likeApi: "api::evidence-like.evidence-like",
    relationField: "evidence",
  },
};

module.exports = {
  fetchLikeStatus: async (ctx) => {
    const { contentType, id } = ctx.params;
    const user = ctx.state.user;
    const config = CONTENT_TYPES[contentType];

    if (!config) {
      return { success: false, message: "Invalid content type" };
    }

    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    const contentExists = await strapi
      .documents(config.contentApi)
      .findOne({ documentId: id });

    if (!contentExists) {
      return { success: false, message: `${contentType} not found` };
    }

    const likeRecord = await strapi.documents(config.likeApi).findMany({
      filters: { [config.relationField]: { documentId: id } },
      populate: { users: { fields: ["id", "username"] } },
    });

    if (!likeRecord || likeRecord.length === 0) {
      await strapi.documents(config.likeApi).create({
        data: {
          [config.relationField]: id,
          users: [],
          date: new Date(),
        },
      });
      return {
        success: true,
        data: { likeStatus: false, likesCount: 0 },
      };
    }

    const isLiked = likeRecord[0]?.users?.some((u) => u.id === user.id);
    return {
      success: true,
      data: {
        likeStatus: isLiked,
        likesCount: likeRecord[0]?.users?.length || 0,
      },
    };
  },

  toggleUserLike: async (ctx) => {
    const { contentType, id } = ctx.params;
        console.log("config", contentType);

    const user = ctx.state.user;
    const config = CONTENT_TYPES[contentType];
    if (!config) {
      return { success: false, message: "Invalid content type" };
    }

    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    const contentExists = await strapi
      .documents(config.contentApi)
      .findOne({ documentId: id });

    if (!contentExists) {
      return { success: false, message: `${contentType} not found` };
    }

    const likeRecord = await strapi.documents(config.likeApi).findMany({
      filters: { [config.relationField]: { documentId: id } },
      populate: { users: { fields: ["id", "username"] } },
    });

    if (!likeRecord || likeRecord.length === 0) {
      await strapi.documents(config.likeApi).create({
        data: {
          [config.relationField]: { documentId: id },
          users: [user.id],
          date: new Date(),
        },
      });
      return {
        success: true,
        message: `${contentType} liked successfully`,
        data: { likeStatus: true, likesCount: 1 },
      };
    }

    const isLiked = likeRecord[0]?.users?.some((u) => u.id === user.id);
    let updatedRecord;

    if (isLiked) {
      const usersToKeep = likeRecord[0].users
        .filter((u) => u.id !== user.id)
        .map((u) => u.id);
      updatedRecord = await strapi.documents(config.likeApi).update({
        documentId: likeRecord[0].documentId,
        data: { users: { set: usersToKeep } },
        populate: { users: { fields: ["id", "username"] } },
      });
    } else {
      updatedRecord = await strapi.documents(config.likeApi).update({
        documentId: likeRecord[0].documentId,
        data: { users: { connect: [user.id] } },
        populate: { users: { fields: ["id", "username"] } },
      });
    }

    return {
      success: true,
      message: isLiked ? "Unliked successfully" : "Liked successfully",
      data: {
        likeStatus: !isLiked,
        likesCount: updatedRecord.users.length,
      },
    };
  },
};