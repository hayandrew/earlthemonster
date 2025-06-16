import { getContent } from '@/utils/content';
import { generatePageMetadata } from '@/utils/seo';
import ImageGallery from '@/components/ImageGallery';

export async function generateMetadata() {
  const content = await getContent('about');
  return generatePageMetadata('about', content);
}

export default async function About() {
  const content = await getContent('about');

  return (
    <div className="py-12">
      {/* Book Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {content.bookSection.title}
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            {content.bookSection.description}
          </p>
        </div>
        <ImageGallery
          title={content.bookSection.gallery.title}
          images={content.bookSection.gallery.images}
        />
      </section>

      {/* Behind the Scenes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {content.behindTheScenes.title}
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            {content.behindTheScenes.description}
          </p>
        </div>
        <ImageGallery
          title={content.behindTheScenes.gallery.title}
          images={content.behindTheScenes.gallery.images}
        />
      </section>
    </div>
  );
} 