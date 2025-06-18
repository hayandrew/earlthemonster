import { getContent } from '@/utils/content';
import { generatePageMetadata } from '@/utils/seo';
import Link from 'next/link';

export async function generateMetadata() {
  const content = await getContent('home');
  return generatePageMetadata('home', content);
}

export default async function Home() {
  const content = await getContent('home');

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl font-serif">
              {content.hero.title}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl md:max-w-3xl font-sans">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {content.features.map((feature: any, index: number) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-bold text-white font-serif">{feature.title}</h3>
                <p className="mt-2 text-base text-white font-sans">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-serif">{content.cta.text}</h2>
          <div className="mt-8">
            <Link
              href="/order"
              className="inline-flex items-center bg-[#ffe03b] text-black font-bold rounded-full hover:bg-yellow-300 transition-colors font-sans"
              style={{boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '6px 18px'}}
            >
              {content.cta.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
