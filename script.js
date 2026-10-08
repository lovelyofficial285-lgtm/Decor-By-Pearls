(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 767.98px)").matches;

  const initNavbar = () => {
    const header = document.getElementById("siteHeader");

    if (!header) return;

    const toggleNavbar = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 80);
    };

    toggleNavbar();
    window.addEventListener("scroll", toggleNavbar, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        const mobileMenuElement = document.getElementById("mobileMenu");
        const mobileMenu = bootstrap.Offcanvas.getInstance(mobileMenuElement);

        if (mobileMenu) {
          mobileMenu.hide();
        }
      });
    });

    const mobileMenuElement = document.getElementById("mobileMenu");

    if (!mobileMenuElement || prefersReducedMotion || typeof gsap === "undefined") return;

    mobileMenuElement.addEventListener("show.bs.offcanvas", () => {
      const links = mobileMenuElement.querySelectorAll(".mobile-menu__links a");

      gsap.fromTo(links, {
        y: 26,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        overwrite: true
      });
    });
  };

  const initHeroSlider = () => {
    const slides = document.querySelectorAll(".hero__slide");
    const indicators = document.querySelectorAll(".hero__indicator");

    if (!slides.length || !indicators.length) return;

    if (prefersReducedMotion || typeof gsap === "undefined") {
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === 0);
      });

      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("is-active", index === 0);
      });

      return;
    }

    let currentIndex = 0;

    const showSlide = (nextIndex) => {
      const currentSlide = slides[currentIndex];
      const nextSlide = slides[nextIndex];
      const currentIndicator = indicators[currentIndex];
      const nextIndicator = indicators[nextIndex];

      currentSlide.classList.remove("is-active");
      currentIndicator.classList.remove("is-active");

      nextSlide.classList.add("is-active");
      nextIndicator.classList.add("is-active");

      gsap.fromTo(nextSlide.querySelector("img"), {
        scale: 1.15
      }, {
        scale: 1,
        duration: 6,
        ease: "none"
      });

      currentIndex = nextIndex;
    };

    gsap.set(slides[0].querySelector("img"), {
      scale: 1.15
    });

    gsap.to(slides[0].querySelector("img"), {
      scale: 1,
      duration: 6,
      ease: "none"
    });

    const slideshow = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        const nextIndex = (currentIndex + 1) % slides.length;

        showSlide(nextIndex);
      }
    });

    slideshow.to({}, {
      duration: 6
    });

    slideshow.to({}, {
      duration: 1.2,
      onStart: () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[nextIndex];

        nextSlide.classList.add("is-active");
        indicators[nextIndex].classList.add("is-active");

        gsap.fromTo(nextSlide.querySelector("img"), {
          scale: 1.15
        }, {
          scale: 1,
          duration: 6,
          ease: "none"
        });

        gsap.to(currentSlide, {
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          onComplete: () => {
            currentSlide.classList.remove("is-active");
            indicators[currentIndex].classList.remove("is-active");
          }
        });

        currentIndex = nextIndex;
      }
    });
  };

  const initHeroIntro = () => {
    if (prefersReducedMotion || typeof gsap === "undefined") return;

    const eyebrow = document.querySelector(".hero__eyebrow");
    const titleLines = document.querySelectorAll(".hero__line span");
    const subtitle = document.querySelector(".hero__subtitle");
    const buttons = document.querySelectorAll(".hero__actions .btn");

    const intro = gsap.timeline({
      defaults: {
        ease: "power3.out",
        duration: 1.1
      }
    });

    intro
      .from(eyebrow, {
        y: 24,
        opacity: 0
      })
      .to(titleLines, {
        y: 0,
        stagger: 0.12
      }, "-=0.8")
      .from(subtitle, {
        y: 22,
        opacity: 0
      }, "-=0.75")
      .from(buttons, {
        y: 18,
        opacity: 0,
        stagger: 0.12
      }, "-=0.75");

    if (window.matchMedia("(min-width: 1024px)").matches) {
      document.querySelectorAll(".magnetic-btn").forEach((button) => {
        const moveX = gsap.quickTo(button, "x", {
          duration: 0.35,
          ease: "power3.out"
        });

        const moveY = gsap.quickTo(button, "y", {
          duration: 0.35,
          ease: "power3.out"
        });

        button.addEventListener("mousemove", (event) => {
          const rect = button.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;

          moveX(x * 0.16);
          moveY(y * 0.16);
        });

        button.addEventListener("mouseleave", () => {
          moveX(0);
          moveY(0);
        });
      });
    }
  };

  const initMarquee = () => {
    const track = document.querySelector(".marquee__track");

    if (!track || typeof gsap === "undefined") return;

    if (prefersReducedMotion) {
      gsap.set(track, {
        xPercent: 0
      });

      return;
    }

    const marqueeTween = gsap.to(track, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1
    });

    track.addEventListener("mouseenter", () => {
      marqueeTween.timeScale(0);
    });

    track.addEventListener("mouseleave", () => {
      marqueeTween.timeScale(1);
    });

    let lastScroll = window.scrollY;

    ScrollTrigger.create({
      onUpdate: () => {
        const currentScroll = window.scrollY;
        const velocity = currentScroll - lastScroll;

        lastScroll = currentScroll;

        if (velocity > 0) {
          marqueeTween.timeScale(Math.min(2.4, 1 + Math.abs(velocity) / 180));
        } else if (velocity < 0) {
          marqueeTween.timeScale(Math.max(-2.4, -1 - Math.abs(velocity) / 180));
        }

        gsap.to(marqueeTween, {
          timeScale: velocity >= 0 ? 1 : -1,
          duration: 0.8,
          ease: "power2.out",
          overwrite: true
        });
      }
    });
  };

  const initDoorReveal = () => {
    const section = document.getElementById("doorReveal");
    const stage = document.querySelector(".door-reveal__stage");
    const leftDoor = document.querySelector(".door--left");
    const rightDoor = document.querySelector(".door--right");
    const backdropImage = document.querySelector(".door-reveal__backdrop img");
    const gapShadow = document.querySelector(".door-reveal__gap-shadow");
    const contentElements = document.querySelectorAll(".door-reveal__eyebrow, .door-reveal__line span, .door-reveal__content .btn");

    if (!section || !stage || !leftDoor || !rightDoor) return;

    if (prefersReducedMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      leftDoor.style.opacity = "0";
      rightDoor.style.opacity = "0";
      backdropImage.style.transform = "none";
      contentElements.forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });

      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    document.body.classList.add("js-animations-enabled");

    const pinDistance = isMobile ? "+=120%" : "+=150%";

    const doorTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: pinDistance,
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    doorTimeline
      .to(backdropImage, {
        scale: 1,
        ease: "none",
        duration: 1
      }, 0)
      .to(".door__hint", {
        opacity: 0,
        ease: "none",
        duration: 0.12
      }, 0)
      .to(leftDoor, {
        rotateY: -95,
        xPercent: -8,
        opacity: 0,
        ease: "none",
        duration: 1
      }, 0.08)
      .to(rightDoor, {
        rotateY: 95,
        xPercent: 8,
        opacity: 0,
        ease: "none",
        duration: 1
      }, 0.08)
      .to(gapShadow, {
        opacity: 0.8,
        ease: "none",
        duration: 0.35
      }, 0.08)
      .to(gapShadow, {
        opacity: 0,
        ease: "none",
        duration: 0.45
      }, 0.55)
      .fromTo(contentElements, {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power3.out",
        duration: 0.8
      }, 0.42);
  };

  const init = () => {
    initNavbar();
    initHeroSlider();
    initHeroIntro();
    initMarquee();
    initDoorReveal();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();