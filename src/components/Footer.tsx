const Footer = () => {
  return (
    <footer className="text-white border-t" style={{borderTop: '1px solid #2995ae'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Earl's Elastic, Stretchy Socks</h3>
            <p className="text-gray-300">
            A bedtime story about a furry monster and his magical socks.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">About the Book</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
              <li><a href="/order" className="text-gray-300 hover:text-white">Order Now</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Email: info@earlthemonster.com<br />
              Follow us on social media
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center text-gray-300" style={{borderTop: '1px solid #2995ae'}}>
          <p>&copy; {new Date().getFullYear()} Earl the Monster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 