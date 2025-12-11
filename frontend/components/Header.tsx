import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, NavLink } from '../constants';
import ThemeSwitcher from './ui/ThemeSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, ChevronDown } from 'lucide-react';
import { usePopup } from '../contexts/PopupContext';

const MegaMenu: React.FC<{ items: NavLink[]; closeMenu: () => void; theme: 'light' | 'dark' }> = ({ items, closeMenu, theme }) => {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`mt-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700`}>
          <div className="grid grid-cols-2 gap-4 p-6" style={{ minWidth: '40rem' }}>
            {items.map((item) => (
              <Link
                key={item.name}
                to={item.path || '#'}
                onClick={closeMenu}
                className={`group flex items-start space-x-4 p-4 rounded-lg bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200`}
              >
                {item.icon && <item.icon className="w-8 h-8 text-amber-400 mt-1 flex-shrink-0" />}
                <div>
                  <p className={`font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300`}>{item.name}</p>
                  <p className={`text-sm text-slate-600 dark:text-slate-300`}>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavMenuItem: React.FC<{ item: NavLink; closeMenu: () => void; isLightOpaque: boolean; theme: 'light' | 'dark' }> = ({ item, closeMenu, isLightOpaque, theme }) => {
  const textColor = isLightOpaque ? 'text-slate-800' : 'text-white';
  const hoverColor = isLightOpaque ? 'hover:text-amber-600' : 'hover:text-amber-300';

  if (item.subMenu) {
    return (
      <div className="relative group py-7 px-4">
        <button className={`${textColor} ${hoverColor} transition-colors duration-300 flex items-center font-medium`}>
          {item.name}
          <ChevronDown className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:rotate-180" />
        </button>
        <div className="opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto transform-gpu translate-y-4 group-hover:translate-y-0">
          <MegaMenu items={item.subMenu} closeMenu={closeMenu} theme={theme} />
        </div>
      </div>
    );
  }

  return (
    <Link to={item.path || '#'} onClick={closeMenu} className={`py-7 px-4 ${textColor} ${hoverColor} transition-colors duration-300 font-medium`}>
      {item.name}
    </Link>
  );
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  const { openPopup } = usePopup();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // This effect ensures the header only becomes visible after the initial render, preventing any flicker.
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100); // A small delay to ensure styles are applied
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      if (isMobileMenuOpen) {
        setIsHidden(false);
        setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
        return;
      }

      const headerHeight = 80;
      if (currentScrollY > headerHeight && currentScrollY > lastScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isOpaque = isScrolled || !isHomePage;
  const isLightOpaque = isOpaque && theme === 'light';

  const backgroundClass = isOpaque
    ? 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-slate-800/50'
    : 'bg-black/0 backdrop-blur-none shadow-none';

  const transitionClass = 'transition-[background-color,backdrop-filter,box-shadow,transform,border-color,opacity] duration-300';

  const logoSrc = isLightOpaque
    ? "/images/omkar-logo-all.png"
    : "/images/omkar-logo-white.png";

  const logoTextColorClass = isLightOpaque ? 'text-slate-800' : 'text-white';

  const buttonTextColorClass = isLightOpaque ? 'text-slate-800' : 'text-white';
  const buttonTextHoverClass = isLightOpaque ? 'hover:text-amber-600' : 'hover:text-amber-300';

  const themeSwitcherClassName = `${buttonTextColorClass} ${isLightOpaque ? 'hover:bg-black/10' : 'hover:bg-white/10'}`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${transitionClass} ${backgroundClass} ${isHidden ? '-translate-y-full' : 'translate-y-0'} ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img className={`h-14 transition-all duration-300`} src={logoSrc} alt="Omkar International School Logo" />
              <span className={`text-xl font-bold hidden sm:block transition-colors duration-300 ${logoTextColorClass}`}>Omkar International School</span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center">
            <nav className="flex items-center space-x-8">
              {NAV_LINKS.map((item) => (
                <NavMenuItem key={item.name} item={item} closeMenu={() => { }} isLightOpaque={isLightOpaque} theme={theme} />
              ))}
            </nav>
            <div className="flex items-center ml-8 space-x-4">
              <ThemeSwitcher className={themeSwitcherClassName} />
              <button onClick={openPopup} className="bg-amber-500 text-slate-900 font-bold py-2 px-6 rounded-full hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 shadow-md">
                Join Us
              </button>
            </div>
          </div>
          <div className="lg:hidden flex items-center space-x-4">
            <ThemeSwitcher className={themeSwitcherClassName} />
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className={`${buttonTextColorClass} ${buttonTextHoverClass} focus:outline-none`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className={`lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-white/20 dark:border-slate-700/50`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((item) => (
              <MobileNavMenuItem key={item.name} item={item} theme={theme} />
            ))}
            <button
              onClick={() => {
                openPopup();
                setMobileMenuOpen(false);
              }}
              className="block text-center w-full mt-4 bg-amber-500 text-slate-900 font-bold py-3 px-6 rounded-md hover:bg-amber-400 transition-colors duration-300">
              Join Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


const MobileNavMenuItem: React.FC<{ item: NavLink, theme: 'light' | 'dark' }> = ({ item, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLight = theme === 'light';

  if (item.subMenu) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left py-2 px-3 font-medium rounded-md flex justify-between items-center ${isLight ? 'text-slate-800 hover:bg-slate-100/50' : 'text-slate-200 hover:bg-slate-700/50'}`}
        >
          {item.name}
          <ChevronDown className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="pl-4 mt-1 space-y-1">
            {item.subMenu.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.path || '#'}
                className={`block py-2 px-3 text-sm font-medium rounded-md ${isLight ? 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}
              >
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link to={item.path || '#'} className={`block py-2 px-3 font-medium rounded-md ${isLight ? 'text-slate-800 hover:bg-slate-100/50' : 'text-slate-200 hover:bg-slate-700/50'}`}>
      {item.name}
    </Link>
  );
};

export default Header;