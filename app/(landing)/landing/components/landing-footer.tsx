import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react"
import Link from "next/link"

const LandingFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="font-bold text-xl text-blue-700">Seekr</span>
            </div>
            <p className="text-gray-600 mb-4">
              Connecting students to opportunities and helping employers find the perfect talent.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-700">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-700">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-700">
                <Instagram className="w-5 h-5" />
              </a>

            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about-us" className="text-gray-600 hover:text-blue-700">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-blue-700">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-700">
                  FAQ
                </Link>
              </li>
              <li>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/legal#privacy-policy" className="text-gray-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal#terms-and-conditions" className="text-gray-600 hover:text-blue-700">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal#user-agreement" className="text-gray-600 hover:text-blue-700">
                  User Agreement
                </Link>
              </li>
              <li>
                <Link href="/legal#platform-guidelines" className="text-gray-600 hover:text-blue-700">
                  Platform Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-700 mr-2 mt-0.5" />
                <span className="text-gray-600">STI College Alabang, Metro Manila, Philippines</span>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-700 mr-2 mt-0.5" />
                <span className="text-gray-600">seekr.support@gmail.com</span>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-blue-700 mr-2 mt-0.5" />
                <span className="text-gray-600">+63 928 391 9443</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-700 text-white py-6">
        <div className="container mx-auto px-6 text-center md:text-left">
          <p>© {new Date().getFullYear()} Seekr. All rights reserved.</p>
          <p className="text-blue-100">Bridging the gap between education and employment</p>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
