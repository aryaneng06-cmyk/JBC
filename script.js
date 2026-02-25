document.addEventListener("DOMContentLoaded", () => {
  /* --- STICKY NAVBAR & ACTIVE LINKS --- */
  const navbar = document.querySelector(".navbar");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight * 0.5) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link highlighting
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // Mobile Hamburger Menu
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      document.querySelector(".nav-links").classList.toggle("nav-active");
      hamburger.classList.toggle("toggle");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        document.querySelector(".nav-links").classList.remove("nav-active");
        if (hamburger) hamburger.classList.remove("toggle");
      }
    });
  });

  /* --- INITIAL HERO ANIMATION --- */
  setTimeout(() => {
    // Hero logo
    const jbcLetters = document.querySelector(".jbc-letters");
    if (jbcLetters) jbcLetters.classList.add("visible");

    const wordmarkStr = document.querySelector(".wordmark-strip");
    if (wordmarkStr) wordmarkStr.classList.add("visible");

    // Tagline & bottom
    const tagline = document.querySelector(".hero-tagline");
    if (tagline) tagline.classList.add("visible");

    const bottom = document.querySelector(".hero-bottom");
    if (bottom) bottom.classList.add("visible");
  }, 100);

  /* --- COLOR DELIVERABLES TABLE SYMBOLS --- */
  const tds = document.querySelectorAll(".custom-table td");
  tds.forEach((td) => {
    const text = td.textContent.trim();
    if (text === "✦") {
      td.style.color = "#C8102E";
      td.style.textShadow = "0 0 10px rgba(200, 16, 46, 0.8)";
    } else if (text === "—") {
      td.style.color = "rgba(255, 255, 255, 0.25)";
    } else if (text === "OPT") {
      td.style.color = "rgba(255, 255, 255, 0.45)";
      td.style.fontStyle = "italic";
      td.style.fontSize = "12px";
    }
  });

  /* --- LIQUID RIPPLE EFFECT --- */
  document.querySelectorAll(".glass, .glass-dark, .glass-red").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let baseAlpha = "0.03";
      if (el.classList.contains("glass-dark")) baseAlpha = "0.2";

      el.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 40%), rgba(255,255,255,${baseAlpha})`;
    });

    el.addEventListener("mouseleave", () => {
      if (el.classList.contains("glass-dark")) {
        el.style.background = "rgba(10, 10, 15, 0.45)";
      } else if (el.classList.contains("glass-red")) {
        el.style.background = "rgba(200, 16, 46, 0.18)";
      } else {
        el.style.background = "rgba(255, 255, 255, 0.06)";
      }
    });
  });

  /* --- SCROLL ANIMATIONS (INTERSECTION OBSERVER) --- */
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        el.classList.add("visible");

        // Handle stagger children explicitly
        if (
          el.classList.contains("cards-grid") ||
          el.classList.contains("stats-row") ||
          el.classList.contains("contact-cards")
        ) {
          const staggers = el.querySelectorAll(".reveal-up-stagger");
          staggers.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("visible");
            }, index * 150);
          });
        }

        if (el.classList.contains("tier-rows")) {
          const staggers = el.querySelectorAll(".reveal-fade-left");
          staggers.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("visible");
            }, index * 150);
          });
        }

        // Count up animation for stats
        if (
          el.classList.contains("stat-number") &&
          !el.classList.contains("counted")
        ) {
          el.classList.add("counted");
          const target = parseInt(el.getAttribute("data-target"));
          let count = 0;
          const duration = 2000;
          const interval = Math.max(10, duration / target);

          const updateCount = () => {
            if (count < target) {
              count += Math.ceil(target / (duration / interval));
              if (count > target) count = target;
              el.innerText = count;
              setTimeout(updateCount, interval);
            } else {
              el.innerText = target;
            }
          };
          updateCount();
        }

        // Closing statement sequence
        if (el.classList.contains("closing-heading")) {
          const words = el.querySelectorAll(".closing-word");
          words.forEach((word, index) => {
            setTimeout(() => {
              word.classList.add("visible");
            }, index * 200);
          });
          const redWord = el.querySelector(".closing-word-red");
          if (redWord) {
            setTimeout(() => {
              redWord.classList.add("visible");
            }, words.length * 200);
          }
        }

        obs.unobserve(el); // align with minimalist "once only" feel
      }
    });
  }, observerOptions);

  // Elements to observe
  const elementsToObserve = document.querySelectorAll(`
        .reveal-up,
        .reveal-slide-left,
        .reveal-slide-right,
        .reveal-fade-strip,
        .reveal-fade-cta,
        .cards-grid,
        .stats-row,
        .tier-rows,
        .contact-cards,
        .stat-number,
        .closing-heading
    `);

  elementsToObserve.forEach((el) => observer.observe(el));
});
