import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTopButton from './ui/ScrollToTopButton';
import Chatbot from './ui/Chatbot';
import AdmissionPopup from './ui/AdmissionPopup';

const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const cursorRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const blob = document.getElementById('blob');
    const cursor = cursorRef.current;
    if (!blob || !cursor) return;

    const handlePointerMove = (e: PointerEvent) => {
      window.requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        
        blob.animate({
          left: `${clientX}px`,
          top: `${clientY}px`
        }, { duration: 3000, fill: "forwards" });

        if (cursor) {
          cursor.style.left = `${clientX}px`;
          cursor.style.top = `${clientY}px`;
        }

        const target = e.target as Element;
        if (cursor) {
            if (target.closest('a, button, [role="button"], input, select, label, [onclick]')) {
                cursor.classList.add('hover');
            } else {
                cursor.classList.remove('hover');
            }
        }
        
        if (isDrawingRef.current) {
            const { x: lastX, y: lastY } = lastPosRef.current;
            
            const distance = Math.hypot(clientX - lastX, clientY - lastY);
            const angle = Math.atan2(clientY - lastY, clientX - lastX) * (180 / Math.PI);

            // Create a line element instead of dots for a smooth trail
            const lineEl = document.createElement('div');
            lineEl.classList.add('pencil-trail');
            lineEl.style.left = `${lastX}px`;
            lineEl.style.top = `${lastY}px`;
            lineEl.style.width = `${distance}px`;
            lineEl.style.transform = `rotate(${angle}deg)`;

            document.body.appendChild(lineEl);

            // Set a timeout to remove the element after the animation
            setTimeout(() => {
                lineEl.remove();
            }, 1500);
        }
        lastPosRef.current = { x: clientX, y: clientY };
      });
    };

    const handlePointerClick = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const alphabets = ['A', 'B', 'C', 'O', 'I', 'S'];
        const sparkles = ['✦', '✧', '✨'];
        const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
        const burstCount = 8;

        for (let i = 0; i < burstCount; i++) {
            const particleEl = document.createElement('div');
            particleEl.classList.add('click-particle');
            
            const isAlphabet = Math.random() > 0.4; // 60% chance of alphabet

            if (isAlphabet) {
                particleEl.innerHTML = alphabets[Math.floor(Math.random() * alphabets.length)];
                particleEl.style.fontSize = `${Math.random() * 1.2 + 1}rem`;
            } else {
                particleEl.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
                particleEl.style.fontSize = `${Math.random() * 1 + 0.8}rem`;
            }

            particleEl.style.color = colors[Math.floor(Math.random() * colors.length)];
            particleEl.style.left = `${clientX}px`;
            particleEl.style.top = `${clientY}px`;

            const randomX = (Math.random() - 0.5) * 180;
            const randomY = (Math.random() - 0.5) * 180;
            particleEl.style.setProperty('--tx', `${randomX}px`);
            particleEl.style.setProperty('--ty', `${randomY}px`);

            document.body.appendChild(particleEl);
            particleEl.addEventListener('animationend', () => {
                particleEl.remove();
            }, { once: true });
        }
    };
    
    const handleDrawStart = (e: PointerEvent) => {
        if (e.button !== 0) return; // Only for left click
        isDrawingRef.current = true;
        lastPosRef.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleDrawEnd = () => {
        isDrawingRef.current = false;
    };


    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('click', handlePointerClick);
    window.addEventListener('pointerdown', handleDrawStart);
    window.addEventListener('pointerup', handleDrawEnd);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handlePointerClick);
      window.removeEventListener('pointerdown', handleDrawStart);
      window.removeEventListener('pointerup', handleDrawEnd);
    };
  }, []);
  
  return (
    <div className="isolate flex flex-col min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div id="custom-cursor" ref={cursorRef}></div>
      <div id="blob" className="-z-10"></div>
      <Header />
      <main className={`flex-grow ${isHomePage ? '' : 'pt-20'}`}>
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50">
        <Chatbot />
      </div>
      <div className="fixed bottom-8 left-8 z-40">
        <ScrollToTopButton />
      </div>
      <AdmissionPopup />
    </div>
  );
};

export default Layout;