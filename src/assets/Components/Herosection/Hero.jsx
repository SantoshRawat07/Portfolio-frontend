import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';
import portfolio from '../../Image/profilee.png';
import htmlIcon from '../../Image/Techstack/html-5.svg';
import jsIcon from '../../Image/Techstack/javascript-logo.svg';
import tsIcon from '../../Image/Techstack/typescript-official.svg';
import twIcon from '../../Image/Techstack/tailwind.svg';
import reactIcon from '../../Image/Techstack/react.svg';
import nextIcon from '../../Image/Techstack/next-js.svg';
import nodeIcon from '../../Image/Techstack/node-js.svg';
import nestIcon from '../../Image/Techstack/nest-service-ts.svg';
import pgIcon from '../../Image/Techstack/postgresql-logo.svg';
import postmanIcon from '../../Image/Techstack/postman-icon.svg';
import cv from '../../Cv/Santosh_Rawat_Cv.pdf';

const techRow1 = [
  { name: 'HTML5', icon: htmlIcon },
  { name: 'JavaScript', icon: jsIcon },
  { name: 'TypeScript', icon: tsIcon },
  { name: 'Tailwind', icon: twIcon },
  { name: 'React', icon: reactIcon },
];

const techRow2 = [
  { name: 'Next.js', icon: nextIcon },
  { name: 'Node.js', icon: nodeIcon },
  { name: 'NestJS', icon: nestIcon },
  { name: 'PostgreSQL', icon: pgIcon },
  { name: 'Postman', icon: postmanIcon },
];

const HeroSection = ({ setShowNavbar }) => {
  const navigate = useNavigate();
  const containerRef = useRef();
  const rightPanelRef = useRef();
  const animatedTextRef = useRef([]);
  const lastScroll = useRef(0);
  const studioRef = useRef();
  const topTextRef = useRef();
  const imageRef = useRef();
  const btnContainerRef = useRef();
  const btnLabelRef = useRef();
  const btn1Ref = useRef();
  const btn2Ref = useRef();
  const btn3Ref = useRef();
  const [showTopText, setShowTopText] = useState(true);
  const [rightDone, setRightDone] = useState(false); // ← KEY STATE

  // ── Wheel hijack ── (desktop split-layout only — md now stacks normally)
  useEffect(() => {
    const container = containerRef.current;
    const rightPanel = rightPanelRef.current;
    if (!container || !rightPanel) return;

    const onWheel = (e) => {
      if (window.innerWidth < 1024) return;

      const { scrollTop, scrollHeight, clientHeight } = rightPanel;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
      const atTop = scrollTop <= 0;

      if (e.deltaY > 0) {
        if (!atBottom) {
          // Right panel still has content — hijack scroll
          e.preventDefault();
          rightPanel.scrollTop += e.deltaY;
        }
        // atBottom → do nothing, page scrolls naturally downward
      } else if (e.deltaY < 0) {
        // Scrolling back up — if page is at top of below-content, re-enter right panel
        const pageScrollTop = window.scrollY || document.documentElement.scrollTop;
        if (pageScrollTop <= 0 && !atTop) {
          e.preventDefault();
          rightPanel.scrollTop += e.deltaY;
        }
        // else let page scroll up normally
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // ── Touch hijack ── (desktop split-layout only — md now stacks normally)
  useEffect(() => {
    const container = containerRef.current;
    const rightPanel = rightPanelRef.current;
    if (!container || !rightPanel) return;

    let startY = 0;

    const onTouchStart = (e) => { startY = e.touches[0].clientY; };

    const onTouchMove = (e) => {
      if (window.innerWidth < 1024) return;
      const deltaY = startY - e.touches[0].clientY;
      const { scrollTop, scrollHeight, clientHeight } = rightPanel;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
      const atTop = scrollTop <= 0;

      if (deltaY > 0 && !atBottom) {
        e.preventDefault();
        rightPanel.scrollTop += deltaY;
        startY = e.touches[0].clientY;
      } else if (deltaY < 0 && !atTop) {
        e.preventDefault();
        rightPanel.scrollTop += deltaY;
        startY = e.touches[0].clientY;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // ── Track when right panel finishes → un-sticky the hero ──
const handleRightScroll = () => {
  const rightPanel = rightPanelRef.current;
  if (!rightPanel) return;

  const scrollTop = rightPanel.scrollTop;
  const { scrollHeight, clientHeight } = rightPanel;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
  const atTop = scrollTop <= 0;

  // Only release sticky when at bottom, re-lock when back at top
  if (atBottom) {
    setRightDone(true);
  } else if (atTop) {
    setRightDone(false);
  }
  // ← remove the plain setRightDone(atBottom) line

  // Navbar visibility
  if (scrollTop < 40) {
    setShowNavbar(true);
  } else if (scrollTop > lastScroll.current) {
    setShowNavbar(false);
  } else {
    setShowNavbar(true);
  }
  lastScroll.current = scrollTop;

  // Top name text visibility (desktop split-layout only)
  if (topTextRef.current && imageRef.current && window.innerWidth >= 1024) {
    const textBottom = topTextRef.current.getBoundingClientRect().bottom;
    const imageTop = imageRef.current.getBoundingClientRect().top;
    setShowTopText(textBottom > imageTop);
  }
};

  // ── GSAP Animations ──
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(studioRef.current, {
      y: 150, opacity: 0, duration: 1.8, delay: 0.5, ease: 'power4.out',
    });

    tl.from(
      animatedTextRef.current.filter(Boolean),
      { y: 100, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.12 },
      '-=1.2'
    );

    tl.from(
      [btn1Ref.current, btn2Ref.current, btn3Ref.current],
      { y: 10, opacity: 0, scale: 0.88, duration: 0.25, ease: 'expo.out', stagger: 0.05 },
      '-=1.2'
    );

    tl.from(btnLabelRef.current, { y: 10, opacity: 0, duration: 0.2, ease: 'expo.out' }, '-=0.1');
  }, []);

  // ── Button effects ──
  const handleBtnHover = (ref) => gsap.to(ref.current, {
    scale: 1.05, y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.18)', duration: 0.25, ease: 'power3.out',
  });

  const handleBtnLeave = (ref) => gsap.to(ref.current, {
    scale: 1, y: 0, boxShadow: '0 0px 0px rgba(0,0,0,0)', duration: 0.35, ease: 'power3.out',
  });

  const handleBtnClick = (ref) => {
    gsap.timeline()
      .to(ref.current, { scale: 0.94, y: 2, duration: 0.08, ease: 'power2.in' })
      .to(ref.current, { scale: 1.04, y: -2, duration: 0.15, ease: 'back.out(2)' })
      .to(ref.current, { scale: 1, y: 0, duration: 0.2, ease: 'power3.out' });
  };

  return (
    <> 
    <div
      className={`flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden bg-white z-10 relative
  ${rightDone ? 'lg:relative' : 'lg:sticky lg:top-0'}`}
      >
        {/* ── Image: visible on mobile, hidden on md (replaced by small avatar below), half-width sticky column on lg (desktop, unchanged) ── */}
<div
  ref={imageRef}
  className="w-full h-64 md:hidden lg:block lg:w-1/2 lg:h-full overflow-hidden bg-white"
>
  <img
    src={portfolio}
    alt="Santosh Rawat"
    className="object-contain w-full h-full"
  />
</div>

        {/* ── Right: stacks below the image on mobile/md, internal scroll panel on lg (desktop, unchanged) ── */}
<div
  ref={rightPanelRef}
  onScroll={handleRightScroll}
  className="w-full h-auto pl-2 pr-6 py-4 space-y-10 bg-white text-black lg:w-[58%] lg:h-full lg:overflow-y-auto lg:pl-2 lg:pr-10 lg:py-10"
  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
>
          {/* Name */}
          <section
  ref={topTextRef}
  className={`flex flex-col items-start lg:items-center transition-all duration-500 -translate-x-4 name-md-shift lg:-translate-x-4 ${
    !showTopText
      ? 'lg:opacity-0 lg:pointer-events-none lg:select-none lg:-translate-y-16'
      : 'lg:opacity-100 lg:translate-y-0'
  }`}
>
            <h1 className="font-bold uppercase mt-4 text-3xl md:text-[160px] leading-none lg:-px-2 ml-4">
              SANTOSH
            </h1>
            <h1
              ref={studioRef}
              className="font-bold uppercase lg:-mt-2 md:-mt-[90px] text-[24px] md:text-[160px] leading-none ml-4"
            >
              RAWAT
            </h1>
          </section>

          {/* Tagline */}
          <section>
            <p
              ref={(el) => (animatedTextRef.current[0] = el)}
              className="text-lg -mt-6 md:text-2xl text-gray-600"
            >
              (Frontend Developer)
            </p>
            <h2
              ref={(el) => (animatedTextRef.current[1] = el)}
              className="lg:text-4xl md:text-6xl font-semibold mt-4"
            >
              Crafting impactful brands
            </h2>
            <h2
              ref={(el) => (animatedTextRef.current[2] = el)}
              className="lg:text-4xl md:text-6xl font-semibold"
            >
              and websites that drive
            </h2>
            <h2
              ref={(el) => (animatedTextRef.current[3] = el)}
              className="lg:text-4xl md:text-6xl font-semibold"
            >
              growth and success.
            </h2>
          </section>

          {/* CTA Buttons */}
          <section ref={btnContainerRef} className="flex flex-wrap gap-3 md:gap-4">
            <button
              ref={btn1Ref}
              onMouseEnter={() => handleBtnHover(btn1Ref)}
              onMouseLeave={() => handleBtnLeave(btn1Ref)}
              onClick={() => { handleBtnClick(btn1Ref); navigate('/projects'); }}
              className="flex items-center gap-2 px-5 py-3 md:px-7 md:py-4 bg-black text-white
                text-sm md:text-base font-semibold rounded-full border-2 border-black
                hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
            >
              <span>View Projects</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <button
              ref={btn2Ref}
              onMouseEnter={() => handleBtnHover(btn2Ref)}
              onMouseLeave={() => handleBtnLeave(btn2Ref)}
              onClick={() => {
                handleBtnClick(btn2Ref);
                const link = document.createElement('a');
                link.href = cv;
                link.download = 'Santosh_Rawat_CV.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-2 px-5 py-3 md:px-7 md:py-4 bg-white text-black
                text-sm md:text-base font-semibold rounded-full border-2 border-black
                hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
            >
              <span>Download CV</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
          </section>

          {/* About Heading — hidden at md (tablet), visible on mobile and desktop */}
          <section className="md:hidden lg:block">
            <p
              ref={(el) => (animatedTextRef.current[6] = el)}
              className="text-lg md:text-2xl text-gray-600"
            >
              (About)
            </p>
            <h2 ref={(el) => (animatedTextRef.current[7] = el)} className="text-3xl md:text-8xl font-extrabold uppercase mt-4">Building</h2>
            <h2 ref={(el) => (animatedTextRef.current[8] = el)} className="text-3xl md:text-8xl font-extrabold uppercase">Creative</h2>
            <h2 ref={(el) => (animatedTextRef.current[9] = el)} className="text-3xl md:text-8xl font-extrabold uppercase">Brands.</h2>
            <h2 ref={(el) => (animatedTextRef.current[10] = el)} className="text-3xl md:text-8xl font-extrabold uppercase">Powerful</h2>
            <h2 ref={(el) => (animatedTextRef.current[11] = el)} className="text-3xl md:text-8xl font-extrabold uppercase">Websites.</h2>
          </section>

          {/* About Paragraphs */}
          <section className="space-y-6">
            <p
              ref={(el) => (animatedTextRef.current[12] = el)}
              className="text-lg md:text-2xl text-gray-600"
            >
              Hello! I'm Santosh Rawat, a B.Sc. IT student and frontend developer
              from Nepal. I enjoy turning ideas into real-world web applications
              with modern frontend technologies.
            </p>
            <p
              ref={(el) => (animatedTextRef.current[13] = el)}
              className="text-lg md:text-2xl text-gray-600"
            >
              My journey started with HTML, CSS, and JavaScript, and gradually
              expanded into React, Next.js, TypeScript, and API integration. I am
              passionate about building responsive websites, interactive user
              interfaces, and modern digital experiences.
            </p>
            <p
              ref={(el) => (animatedTextRef.current[14] = el)}
              className="text-lg md:text-2xl text-gray-600"
            >
              I continuously work on improving my problem-solving skills, UI
              design understanding, and full-stack development knowledge.
              Currently, I am also exploring backend technologies like Node.js and
              NestJS to become a complete full-stack developer.
            </p>
          </section>

          {/* Tech Stack */}
          <section>
            <p
              ref={(el) => (animatedTextRef.current[15] = el)}
              className="text-lg md:text-2xl text-gray-600 mb-4"
            >
              (Tech Stack)
            </p>

            <div className="marquee-wrap overflow-hidden">
              <div className="marquee-track flex">
                {[...techRow1, ...techRow1].map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 mx-2 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-800 whitespace-nowrap"
                  >
                    <img src={tech.icon} alt={tech.name} className="w-6 h-6 object-contain" />
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="marquee-wrap overflow-hidden mt-3">
              <div className="marquee-track reverse flex">
                {[...techRow2, ...techRow2].map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 mx-2 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-800 whitespace-nowrap"
                  >
                    <img src={tech.icon} alt={tech.name} className="w-6 h-6 object-contain" />
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HeroSection;