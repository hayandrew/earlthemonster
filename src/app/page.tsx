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
      <section
        className="relative hero-bg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex">
          <div id="hero-text" className="text-center w-full pb-4 pt-[250px] sm:pt-[390px] md:pt-[500px]">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl font-serif max-w-[740px] mx-auto">
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
                <div className="w-full flex justify-center mb-4" style={{ border: '6px solid #fff', borderRadius: '12px' }}>
                  {feature.title === 'Sock Storage' ? (
                    <img
                      src="/images/stacks_and_stacks.jpg"
                      alt="Stacks and Stacks - Sock Storage"
                      className="w-full h-[260px] object-cover rounded-lg"
                    />
                  ) : feature.title === 'Sparkle Fizz' ? (
                    <img
                      src="/images/in_the_machine.jpg"
                      alt="Sparkle Fizz - In the Machine"
                      className="w-full h-[260px] object-cover rounded-lg"
                    />
                  ) : feature.title === 'Magical Sock Trees' ? (
                    <img
                      src="/images/these_magic_socks.jpg"
                      alt="Magical Sock Trees"
                      className="w-full h-[260px] object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-[160px] bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-base font-semibold">
                      Image Placeholder
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white font-serif">{feature.title}</h3>
                <p className="mt-2 text-2xl text-base text-white font-sans">{feature.description}</p>
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
              className="text-lg inline-flex items-center bg-[#f9d606] text-black font-bold rounded-full hover:bg-yellow-300 transition-colors font-sans"
              style={{boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 34px'}}
            >
              {content.cta.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
