import { Metadata } from 'next';

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

export function generatePageMetadata(page: string, content: any): Metadata {
  const baseTitle = 'Earl the Monster';
  const baseDescription = 'A heartwarming children\'s book about friendship and acceptance';
  
  let seoData: SEOData = {
    title: baseTitle,
    description: baseDescription,
    keywords: ['children\'s book', 'friendship', 'acceptance', 'Earl the Monster'],
  };

  // Generate page-specific metadata based on content
  switch (page) {
    case 'home':
      seoData = {
        title: `${content.hero.title} | ${baseTitle}`,
        description: content.hero.description,
        keywords: [...seoData.keywords!, 'children\'s story', 'illustrated book'],
        ogImage: '/images/book/cover.png',
      };
      break;

    case 'about':
      seoData = {
        title: `${content.bookSection.title} | ${baseTitle}`,
        description: content.bookSection.description,
        keywords: [...seoData.keywords!, 'book details', 'author', 'illustrator'],
        ogImage: '/images/book/cover.png',
      };
      break;

    case 'contact':
      seoData = {
        title: `${content.title} | ${baseTitle}`,
        description: content.description,
        keywords: [...seoData.keywords!, 'contact', 'author contact', 'book inquiries'],
      };
      break;

    case 'order':
      seoData = {
        title: `${content.title} | ${baseTitle}`,
        description: content.description,
        keywords: [...seoData.keywords!, 'purchase', 'buy book', 'order book'],
        ogImage: '/images/book/cover.png',
      };
      break;
  }

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords?.join(', '),
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      images: seoData.ogImage ? [seoData.ogImage] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: seoData.ogImage ? [seoData.ogImage] : undefined,
    },
  };
} 