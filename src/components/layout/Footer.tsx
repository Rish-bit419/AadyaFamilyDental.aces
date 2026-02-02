import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">D</span>
              </div>
              <span className="font-display font-semibold text-xl">
                DentalCare
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your trusted partner for comprehensive dental care. We combine modern technology with gentle care for beautiful, healthy smiles.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">Home</Link>
              <Link to="/about" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">About Us</Link>
              <Link to="/services" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">Our Services</Link>
              <Link to="/book-appointment" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">Book Appointment</Link>
              <Link to="/contact" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">Contact</Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Services</h4>
            <nav className="flex flex-col gap-3">
              <span className="text-primary-foreground/70 text-sm">General Dentistry</span>
              <span className="text-primary-foreground/70 text-sm">Teeth Whitening</span>
              <span className="text-primary-foreground/70 text-sm">Dental Implants</span>
              <span className="text-primary-foreground/70 text-sm">Orthodontics</span>
              <span className="text-primary-foreground/70 text-sm">Cosmetic Dentistry</span>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+1234567890" className="flex items-start gap-3 text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>(123) 456-7890</span>
              </a>
              <a href="mailto:info@dentalcare.com" className="flex items-start gap-3 text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>info@dentalcare.com</span>
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/70 text-sm">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>123 Dental Street, Medical District, City 12345</span>
              </div>
              <div className="flex items-start gap-3 text-primary-foreground/70 text-sm">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2024 DentalCare. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-primary-foreground/50 hover:text-primary transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-primary-foreground/50 hover:text-primary transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
