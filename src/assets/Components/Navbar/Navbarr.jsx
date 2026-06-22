import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaTimes, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

function Navbarr({ visible = true, scrolledUp = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const circleRef = useRef(null);
  const hamburgerBtnRef = useRef(null);
  const navItemsRef = useRef([]);
  const footerRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/case-studies' },
    { name: 'Services', path: '/service' },
    { name: 'Blogs', path: '/blog' },
  ];

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    const circle = circleRef.current;
    const btn = hamburgerBtnRef.current;
    if (!circle || !btn) return;

    const btnRect = btn.getBoundingClientRect();
    const originX = btnRect.left + btnRect.width / 2;
    const originY = btnRect.top + btnRect.height / 2;

    gsap.timeline({
      onComplete: () => setIsOpen(false),
    })
      .to([navItemsRef.current.filter(Boolean), footerRef.current], {
        y: 16,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        stagger: 0.03,
      })
      .to(circle, {
        clipPath: `circle(0% at ${originX}px ${originY}px)`,
        duration: 0.55,
        ease: 'power3.inOut',
      }, '-=0.1');
  };

  useEffect(() => {
    if (isOpen && circleRef.current && hamburgerBtnRef.current) {
      const btnRect = hamburgerBtnRef.current.getBoundingClientRect();
      const originX = btnRect.left + btnRect.width / 2;
      const originY = btnRect.top + btnRect.height / 2;

      gsap.set(circleRef.current, {
        clipPath: `circle(0% at ${originX}px ${originY}px)`,
      });
      gsap.set([navItemsRef.current.filter(Boolean), footerRef.current], {
        y: 24,
        opacity: 0,
      });

      gsap.timeline()
        .to(circleRef.current, {
          clipPath: `circle(150% at ${originX}px ${originY}px)`,
          duration: 0.7,
          ease: 'power3.inOut',
        })
        .to(navItemsRef.current.filter(Boolean), {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.07,
        }, '-=0.25')
        .to(footerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        }, '-=0.2');
    }

    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [isOpen]);

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-[60] transition-transform duration-300
        ${visible ? 'translate-y-0' : '-translate-y-full'}
        ${scrolledUp ? 'bg-white text-black' : 'bg-transparent text-white'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-4xl font-extrabold">DEV.SRC</Link>
        </div>

        {/* Center: Nav Links (desktop only) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex space-x-12 font-semibold">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/case-studies" className="nav-link">Projects</Link></li>
            <li><Link to="/service" className="nav-link">Services</Link></li>
            <li><Link to="/blog" className="nav-link">Blogs</Link></li>
          </ul>
        </div>

        {/* md and below: Contact Us (md only) + Hamburger (md + mobile) */}
        <div className="lg:hidden flex items-center space-x-3">
          <a
             href="https://wa.me/9779864926196?text=Hello%20I%20would%20like%20to%20know%20more%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-black text-white pl-3 pr-2 py-2 rounded-full text-sm font-semibold transition-transform duration-200 hover:-translate-y-1 hover:-translate-x-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.94.56 3.74 1.5 5.27L2 22l4.96-1.3a9.85 9.85 0 0 0 5.08 1.39h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.83 14.07c-.25.7-1.45 1.34-2 1.42-.51.08-1.16.11-1.87-.12-.43-.13-.98-.31-1.69-.61-2.98-1.29-4.92-4.28-5.07-4.48-.15-.2-1.2-1.6-1.2-3.05 0-1.46.77-2.17 1.04-2.47.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.06.92 2.21.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.45.51-.15.14-.3.29-.13.57.17.28.77 1.27 1.65 2.05 1.14 1.01 2.1 1.33 2.4 1.48.3.15.47.13.64-.05.17-.18.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2 .96.3.15.49.22.56.34.07.13.07.74-.18 1.44Z" />
            </svg>
            <span>Contact Us</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="bg-white rounded-full p-[2px] w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L9 3M9 3H4M9 3V8" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button
            ref={hamburgerBtnRef}
            onClick={openMenu}
            aria-label="Open menu"
          >
            <FaBars className="text-2xl" />
          </button>
        </div>

        {/* Right: Contact Us (desktop only) */}
        <div className="hidden lg:block flex-shrink-0">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black text-white pl-4 pr-2.5 py-2.5 rounded-full text-sm font-semibold transition-transform duration-200 hover:-translate-y-1 hover:-translate-x-1"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.94.56 3.74 1.5 5.27L2 22l4.96-1.3a9.85 9.85 0 0 0 5.08 1.39h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.83 14.07c-.25.7-1.45 1.34-2 1.42-.51.08-1.16.11-1.87-.12-.43-.13-.98-.31-1.69-.61-2.98-1.29-4.92-4.28-5.07-4.48-.15-.2-1.2-1.6-1.2-3.05 0-1.46.77-2.17 1.04-2.47.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.06.92 2.21.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.45.51-.15.14-.3.29-.13.57.17.28.77 1.27 1.65 2.05 1.14 1.01 2.1 1.33 2.4 1.48.3.15.47.13.64-.05.17-.18.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2 .96.3.15.49.22.56.34.07.13.07.74-.18 1.44Z" />
                </svg>
                <span>Contact Us</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="bg-white rounded-full p-[3px] w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L9 3M9 3H4M9 3V8" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

      {/* Circle-reveal Overlay Menu */}
      {isOpen && (
        <div
          ref={circleRef}
          className="fixed inset-0 z-50 w-screen h-screen overflow-hidden"
          style={{
            backgroundColor: '#0b0f19',
            clipPath: 'circle(0% at 100% 0%)',
          }}
        >
          <div ref={menuRef} className="relative w-full h-full flex flex-col px-8 py-6">

            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <Link to="/" className="text-white text-4xl font-extrabold" aria-label="Home">
                DEV.SRC
              </Link>
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FaTimes className="text-xl text-white" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 flex flex-col justify-center gap-4">
              {navLinks.map((item, i) => (
                <Link
                  key={item.name}
                  to={item.path}
                  ref={(el) => (navItemsRef.current[i] = el)}
                  onClick={closeMenu}
                  className="text-white text-3xl md:text-4xl font-extrabold uppercase tracking-wide w-fit hover:text-white/70 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Footer: Say Hello + Socials */}
            <div ref={footerRef} className="pb-2">
              <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] mb-1">
                Say Hello
              </p>
              <a
                href="mailto:santoshchettri216@gmail.com"
                className="text-white text-lg font-bold uppercase tracking-wide block mb-6 hover:text-white/70 transition-colors"
              >
                santoshchettri216@gmail.com
              </a>
              <div className="flex items-center gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <FaTwitter className="text-sm text-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <FaInstagram className="text-sm text-white" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <FaLinkedinIn className="text-sm text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbarr;