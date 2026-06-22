import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

const Footer = () => {

const headingRef = useRef(null);
      useEffect(() => {
        const node = headingRef.current;
        if (!node) return;
        let hasAnimated = false;

        const observer = new window.IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                gsap.fromTo(
                  node,
                  { y: 100, opacity: 0 },
                  { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
                );
                observer.disconnect();
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(node);
        return () => observer.disconnect();
      }, []);

  return (
    <div className="bg-black text-white font-sans mb-4">
      {/* Logo */}
      <div className="text-white text-left pt-10 ml-10">
        <h1 ref={headingRef} className="lg:text-[10rem] md:text-[5rem] md:-ml-[20px] lg:font-extrabold md:font-extrabold leading-none">
          LET'S TALK
          <span className="align-center lg:text-[6rem] md:text-[4rem]">©</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-10 pt-10 pb-6 text-white text-base">
        {/* Pages */}
        <div>
          <ul className="mt-2 space-y-2 font-semibold">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/service">Projects</Link></li>
            <li><Link to="/about">Services</Link></li>
            <li><Link to="/letstalk">Contact</Link></li>
          </ul>
        </div>
        <div>
          <ul className="mt-2 space-y-2 font-semibold">
            <li><Link to="/service">Creative website</Link></li>
            <li><Link to="/service">App development</Link></li>
            <li><Link to="/service">SEO</Link></li>
            <li><Link to="/service">Digital Marketing</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <ul className="mt-2 space-y-2 font-semibold">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">Github</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright — sits right below the nav columns, no extra top gap */}
      <div className="text-left px-10 pb-6">
        <p className="text-4xl md:text-2xl">Copyright © 2026 Santosh Rawat. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;