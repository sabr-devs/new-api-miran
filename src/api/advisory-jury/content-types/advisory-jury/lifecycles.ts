let lastRevalidation = 0;
const REVALIDATION_COOLDOWN = 5000; // 5 seconds

export default {
  async afterCreate(event: any) {
    await revalidateNextJS(event);
  },

  async afterUpdate(event: any) {
    await revalidateNextJS(event);
  },

  async afterDelete(event: any) {
    await revalidateNextJS(event);
  },
};

async function revalidateNextJS(event: any): Promise<void> {
  const now = Date.now();

  // Skip if we revalidated recently
  if (now - lastRevalidation < REVALIDATION_COOLDOWN) {
    strapi.log.info("Skipping revalidation - too soon since last call");
    return;
  }

  lastRevalidation = now;

  const nextjsUrl = process.env.NEXTJS_URL;
  const revalidationSecret = process.env.REVALIDATION_SECRET;

  if (!nextjsUrl || !revalidationSecret) {
    strapi.log.error("NEXTJS_URL or REVALIDATION_SECRET not set");
    return;
  }

  try {
    const slug = event?.result?.slug || event?.params?.data?.slug;
    // console.log("slug: ", slug);
    // console.log("event: ", event);
    const response = await fetch(`${nextjsUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${revalidationSecret}`,
      },
      body: JSON.stringify({
        model: "advisory-boards",
        slug: slug,
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      strapi.log.error(
        "Failed to revalidate Next.js cache:",
        response.statusText
      );
    } else {
      strapi.log.info("Successfully revalidated Next.js cache for courses");
    }
  } catch (error) {
    strapi.log.error("Error calling Next.js revalidation:", error);
  }
}
