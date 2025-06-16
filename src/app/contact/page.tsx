import { getContent } from '@/utils/content';
import { generatePageMetadata } from '@/utils/seo';
import ContactForm from '@/components/ContactForm';

export async function generateMetadata() {
  const content = await getContent('contact');
  return generatePageMetadata('contact', content);
}

export default async function Contact() {
  const content = await getContent('contact');

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <div className="rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Contact Info</h2>
              <div className="space-y-4">
                <p className="text-white">
                  <strong>Email:</strong><br/> {content.contactInfo.email}
                </p>
                <p className="text-white">
                  <strong>Phone:</strong><br/> {content.contactInfo.phone}
                </p>
                <p className="text-white">
                  <strong>Address:</strong>{' '}
                  {Array.isArray(content.contactInfo.address)
                    ? (
                        <span className="block">
                          {content.contactInfo.address.map((line: string, idx: number) => (
                            <span key={idx} className="block text-white">{line}</span>
                          ))}
                        </span>
                      )
                    : content.contactInfo.address}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {content.socialMedia.title}
                </h3>
                <div className="flex space-x-4">
                  {content.socialMedia.platforms.map((platform: any, index: number) => (
                    <a
                      key={index}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300"
                    >
                      {platform.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <ContactForm formConfig={content.form} />
          </div>
        </div>
      </div>
    </div>
  );
} 