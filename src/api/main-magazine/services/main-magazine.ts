/**
 * main-magazine service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::main-magazine.main-magazine",
  ({ strapi }) => ({
    findAllMagazinesHero: async () => {
      const magazines = await strapi.entityService.findMany(
        "api::main-magazine.main-magazine",
        {
          status: "published",
          sort: ["createdAt:desc"],

          fields: ["title", "excerpt", "slug", "issue_number", "issue_date"],
          populate: {
            hero_img: {
              fields: ["url", "width", "height"],
            },
          },
        }
      );
      return magazines;
    },
    findAllMagazineForMagazinePage: async () => {
      const magazines = await strapi.entityService.findMany(
        "api::main-magazine.main-magazine",
        {
          sort: ["createdAt:desc"],
          fields: ["title", "slug", "issue_number", "issue_date"],
          populate: {
            magazine_cover: {
              fields: ["url", "width", "height"],
            },
            articles: {
            //   fields: ["article_title", "article_excerpt", "slug"],
              populate: {
                article_image: {
                  fields: ["url", "width", "height"],
                },
                authors: {
                  fields: ["author_name", "slug"],
                  populate: {
                    author_image: {
                      fields: ["url", "width", "height"],
                    },
                  },
                },
              },
            },
          },
        }
      );
      return magazines;
    },
    getMagazineIssueInfo: async (slug) => {
      const magazine = await strapi.entityService.findMany(
        "api::main-magazine.main-magazine",
        {
          filters: {
            slug: {
              $eq: slug,
            },
          },
          fields: [
            "title",
            "excerpt",
            "slug",
            "issue_number",
            "issue_date",
            "download_count",
          ],
          populate: {
            magazine_cover: {
              fields: ["url", "width", "height"],
            },
            articles: {
            //   fields: ["article_title", "article_excerpt", "slug"],
              populate: {
                article_image: {
                  fields: ["url", "width", "height"],
                },
                authors: {
                  fields: ["author_name", "slug"],
                  populate: {
                    author_image: {
                      fields: ["url", "width", "height"],
                    },
                  },
                },
              },
            },
          },
        }
      );
      if (magazine) {
        return magazine;
      }
      return null;
    },
    getMagazineIssuePdf: async (userId, slug) => {
      const isAllowed = await strapi
        .service("api::user-profile.user-profile")
        .findOneByUser(userId);
      console.log(isAllowed[0]?.status);
      if (isAllowed[0]?.status) {
        const magazinePdf = await strapi.entityService.findMany(
          "api::main-magazine.main-magazine",
          {
            filters: {
              slug: {
                $eq: slug,
              },
            },
            fields: ["download_count"],
            populate: {
              pdf: {
                fields: ["url", "width", "height"],
              },
            },
          }
        );
        if (magazinePdf) {
          const updateMagazinePdf = await strapi.entityService.update(
            "api::main-magazine.main-magazine",
            magazinePdf[0].id,
            {
              data: {
                download_count: +magazinePdf[0].download_count + 1,
              },
            }
          );

          return {
            ...magazinePdf[0],
            download_count: updateMagazinePdf.download_count,
          };
        }
        return null;
      } else {
        return null;
      }
    },
  })
);
