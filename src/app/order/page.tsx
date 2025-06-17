import { getContent } from '@/utils/content';
import { generatePageMetadata } from '@/utils/seo';
import OrderForm from '@/components/OrderForm';

export async function generateMetadata() {
  const content = await getContent('order');
  return generatePageMetadata('order', content);
}

export default async function Order() {
  const content = await getContent('order');

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {content.title}
          </h1>
          <p className="text-base sm:text-xl text-white max-w-3xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Book Details */}
          <div className="md:col-span-1 rounded-lg p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">Book Details</h2>
            <div className="space-y-2">
              <p className="text-sm sm:text-base text-white leading-relaxed">
                <strong>Title:</strong> {content.bookDetails.title}
              </p>
              <p className="text-sm sm:text-base text-white leading-relaxed">
                <strong>Author:</strong> {content.bookDetails.author}
              </p>
              <p className="text-sm sm:text-base text-white leading-relaxed">
                <strong>Format:</strong> {content.bookDetails.format}
              </p>
              <p className="text-sm sm:text-base text-white leading-relaxed">
                <strong>Pages:</strong> {content.bookDetails.pages}
              </p>
              <p className="text-sm sm:text-base text-white leading-relaxed">
                <strong>ISBN:</strong> {content.bookDetails.isbn}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-4" >
                <strong>Price: </strong>
                <span dangerouslySetInnerHTML={{ __html: content.bookDetails.price }} />
              </p>
            </div>
          </div>

          {/* Order Form */}
          <div className="md:col-span-2">
            <OrderForm
              shippingOptions={content.shipping.options}
              paymentMethods={content.payment.methods}
              paymentTitle={content.payment.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 