export async function getContent(page: string) {
  try {
    const content = await import(`@/content/${page}.json`);
    return content.default;
  } catch (error) {
    console.error(`Error loading content for ${page}:`, error);
    return {};
  }
} 