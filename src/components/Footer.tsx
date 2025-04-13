import { Facebook, Instagram, Mail, Phone, MapPin, Linkedin } from "lucide-react";
import logo from "../images/backgound_image.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-600 text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centering Content on Laptop View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:flex md:justify-center md:items-center">
          
          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-black">
                  Madanapalle Institute of Technology & Science, Madanapalle, AP 517325
                </span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-black">+91</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-black">Dfesta@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-black mt-12 pt-8">
          <p className="text-center text-black">
            © {currentYear} D'Festa. All rights reserved.
            <p className="text-sm text-orange-500">
            Designed by <span className="text-orange">JK</span>
            </p>
          </p>
        </div>
      </div>
    </footer>
  );
}
