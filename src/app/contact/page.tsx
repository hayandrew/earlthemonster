import { getContent } from '@/utils/content';
import { generatePageMetadata } from '@/utils/seo';
import ContactContent from './ContactContent';

export async function generateMetadata() {
  const content = await getContent('contact');
  return generatePageMetadata('contact', content);
}

export default async function Contact() {
  const content = await getContent('contact');
  return <ContactContent content={content} />;
} 