import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const homeLink = NAV_LINKS.find(link => link.name === 'Home');
  const moreLinks = NAV_LINKS.find(link => link.name === 'More')?.subMenu ?? [];
  
  const quickLinks = [homeLink, ...moreLinks].filter((link): link is { name: string; path: string } => !!(link && link.path));

  const logoSrc = isLight 
    ? "https://www.omkarstate.in/wp-content/uploads/2023/03/OMKAR-ALL-BOARD-LOGO-1024x711.png" 
    : "https://www.omkaricse.in/wp-content/uploads/2023/06/OMKAR-LOGO-WHITE-300x208.png";
  
  const textColor = isLight ? 'text-slate-800' : 'text-white';
  const mutedTextColor = isLight ? 'text-slate-600' : 'text-slate-400';
  const linkColor = isLight ? 'text-slate-600 hover:text-blue-600' : 'text-slate-400 hover:text-amber-300';
  const iconColor = isLight ? 'text-blue-500' : 'text-amber-400';
  const borderColor = isLight ? 'border-slate-200/50' : 'border-slate-700/50';
  const copyrightColor = 'text-slate-500';
  const socialIconColor = isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white';

  return (
    <footer className={`bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-white/20 dark:border-slate-800/50 ${textColor}`}>
      <div className="container mx-auto px-6 pt-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
               <img className="h-14" src={logoSrc} alt="Omkar International School Logo" />
               <span className="text-xl font-bold">Omkar International School</span>
            </Link>
            <p className={`${mutedTextColor} mb-6`}>
              Shaping minds, bodies, and souls. We are committed to excellence through endeavour, fostering global citizens and leaders of tomorrow.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/p/Omkar-International-School-CISCE-100093995900789/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${socialIconColor} transition-colors`}><Facebook className="w-6 h-6" /></a>
              <a href="https://www.instagram.com/omkar_school_cisce_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`${socialIconColor} transition-colors`}><Instagram className="w-6 h-6" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path || '#'} className={`${linkColor} transition-colors duration-300`}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Academics Links */}
           <div>
            <h3 className="text-lg font-semibold mb-6">Academics</h3>
            <ul className="space-y-3">
              {NAV_LINKS.find(l => l.name === 'Academics')?.subMenu?.map((link) => (
                <li key={link.name}>
                  <Link to={link.path || '#'} className={`${linkColor} transition-colors duration-300`}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <address className={`not-italic ${mutedTextColor} space-y-4`}>
              <p className="flex items-start">
                <MapPin className={`w-5 h-5 mr-3 mt-1 flex-shrink-0 ${iconColor}`} />
                <span>P-74/P-89, MIDC Residential Zone, Dombivli East, Maharashtra 421203</span>
              </p>
              <p className="flex items-center">
                <Phone className={`w-5 h-5 mr-3 flex-shrink-0 ${iconColor}`} />
                <a href="tel:+918451007436" className={linkColor}>+91 84510 07436</a>
              </p>
              <p className="flex items-center">
                <Mail className={`w-5 h-5 mr-3 flex-shrink-0 ${iconColor}`} />
                <a href="mailto:omkarschool@gmail.com" className={linkColor}>omkarschool@gmail.com</a>
              </p>
            </address>
          </div>
        </div>

        <div className={`mt-16 border-t ${borderColor} pt-8 flex flex-col items-center justify-center space-y-2`}>
          <p className={`${copyrightColor} text-sm text-center`}>
            © {new Date().getFullYear()} Omkar International School. All Rights Reserved.
          </p>
          <p className={`${copyrightColor} text-sm text-center`}>
            Made with ❤️ <a href="https://www.linkedin.com/in/evin-chacko-chirathalackal-86b83868/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Evin Chacko Chirathalackal</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;