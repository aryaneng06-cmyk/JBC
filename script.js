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

        // Soft red shimmer on entry for glass cards
        if (
          el.classList.contains("card") ||
          el.classList.contains("glass-dark") ||
          el.classList.contains("glass")
        ) {
          const originalBorder = el.style.borderColor;
          el.style.transition = "border-color 0.6s ease";
          el.style.borderColor = "rgba(200, 16, 46, 0.2)";
          setTimeout(() => {
            el.style.borderColor = originalBorder || "";
          }, 600);
        }

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

  /* --- DARK MODE TOGGLE & LIQUID RIPPLE --- */
  const toggle = document.getElementById("theme-toggle");
  const icon = toggle.querySelector(".toggle-icon");

  // Load saved preference
  if (localStorage.getItem("jbc-theme") === "dark") {
    document.body.classList.add("dark-mode");
    icon.textContent = "☀";
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    icon.textContent = isDark ? "☀" : "☽";
    localStorage.setItem("jbc-theme", isDark ? "dark" : "light");

    // Animate the button on click
    toggle.style.transform = "scale(0.85) rotate(20deg)";
    setTimeout(() => {
      toggle.style.transform = "";
    }, 200);
  });

  /* --- 2. DOT INFOGRAPHIC --- */
  const dotGrid = document.getElementById("dotGrid");
  const dotCount = document.getElementById("dotCount");
  let dotsAnimated = false;

  if (dotGrid) {
    // Create 150 dots
    for (let i = 0; i < 150; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dotGrid.appendChild(dot);
    }

    const dots = dotGrid.querySelectorAll(".dot");

    function animateDots() {
      if (dotsAnimated) return;
      dotsAnimated = true;
      let count = 0;
      dots.forEach((dot, i) => {
        setTimeout(() => {
          dot.classList.add("active");
          count++;
          if (dotCount) dotCount.textContent = count;
        }, i * 18); // 18ms per dot = ~2.7s total
      });
    }

    // Trigger on scroll into view
    const dotObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateDots();
        });
      },
      { threshold: 0.3 },
    );

    const statsSection = document.getElementById("overview");
    if (statsSection) dotObserver.observe(statsSection);
  }

  /* --- 3. CURSOR TRAIL --- */
  const trailCount = 5;
  const trailDots = [];

  for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement("div");
    dot.classList.add("trail-dot");
    dot.style.width = `${6 - i}px`;
    dot.style.height = `${6 - i}px`;
    dot.style.opacity = `${((trailCount - i) / trailCount) * 0.6}`;
    document.body.appendChild(dot);
    trailDots.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateTrail() {
    let x = mouseX;
    let y = mouseY;

    trailDots.forEach((dot, i) => {
      // Logic for staggered follow caching
      const prevX = dot.x;
      const prevY = dot.y;

      dot.x = i === 0 ? x : trailDots[i - 1].x;
      dot.y = i === 0 ? y : trailDots[i - 1].y;

      dot.el.style.left = `${dot.x}px`;
      dot.el.style.top = `${dot.y}px`;
      dot.el.style.opacity = `${((trailCount - i) / trailCount) * 0.5}`;
    });

    requestAnimationFrame(animateTrail);
  }

  animateTrail();

  // Hide trail when mouse leaves window
  document.addEventListener("mouseleave", () => {
    trailDots.forEach((dot) => (dot.el.style.opacity = "0"));
  });

  // On hover over clickable elements — trail glows brighter and grows
  document.querySelectorAll("a, button, .card").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      trailDots.forEach((dot) => {
        dot.el.style.background = "#FF2040";
        dot.el.style.transform = "translate(-50%, -50%) scale(1.8)";
        dot.el.style.boxShadow = "0 0 8px rgba(200, 16, 46, 0.6)";
      });
    });
    el.addEventListener("mouseleave", () => {
      trailDots.forEach((dot) => {
        dot.el.style.background = "#C8102E";
        dot.el.style.transform = "translate(-50%, -50%) scale(1)";
        dot.el.style.boxShadow = "none";
      });
    });
  });

  // Disable on mobile — no cursor on touch devices
  if ("ontouchstart" in window) {
    trailDots.forEach((dot) => (dot.el.style.display = "none"));
  }

  /* --- 6. SHIMMER CONTACT CARDS --- */
  document.querySelectorAll('.contact-card').forEach(card => {
    const shimmer = card.querySelector('.card-shimmer');
    if (shimmer) {
      card.addEventListener('mouseenter', () => {
        shimmer.style.animation = 'none';
        shimmer.offsetHeight; // force reflow to restart animation
        shimmer.style.animation = '';
        shimmer.style.opacity = '1';
      });
      card.addEventListener('mouseleave', () => {
        shimmer.style.opacity = '0';
      });
    }
  });

  /* --- 7. SCROLL PROGRESS BAR --- */
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
      }

      // Show glowing tip once user starts scrolling
      if (scrollTop > 10) {
        progressBar.classList.add('active');
      } else {
        progressBar.classList.remove('active');
        progressBar.style.width = '0%';
      }
    });
  }

  /* --- 8. SPONSOR ROI CALCULATOR --- */
  const roiCalculator = document.getElementById('roi-calc');
  if (roiCalculator) {
    const tierMultipliers = {
      title: { students: 1.00, impressions: 1.00, posts: 1.00, media: 1.00 },
      powered: { students: 0.80, impressions: 0.80, posts: 0.70, media: 0.75 },
      co: { students: 0.60, impressions: 0.55, posts: 0.50, media: 0.50 },
      category: { students: 0.40, impressions: 0.35, posts: 0.30, media: 0.00 }
    };

    const baseValues = {
      students: (colleges) => colleges * 10,
      impressions: (colleges) => colleges * 800,
      posts: (colleges) => Math.min(Math.round(colleges * 0.65), 10),
      media: (colleges) => Math.max(Math.round(colleges / 5), 1)
    };

    let currentTier = 'title';
    let currentColleges = 10;

    function formatNumber(n) {
      if (n >= 1000) return n.toLocaleString('en-IN');
      return n.toString();
    }

    function animateValue(el, target) {
      if (!el) return;

      if (target === 0) {
        el.textContent = '—';
        el.style.fontSize = '28px';
        el.style.color = '#888580';
        return;
      }

      el.style.fontSize = '';
      el.style.color = '';

      const start = 0;
      const duration = 600;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);
        el.textContent = formatNumber(current);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    }

    function updateROI() {
      const mult = tierMultipliers[currentTier];
      const colleges = currentColleges;

      const students = Math.round(baseValues.students(colleges) * mult.students);
      const impressions = Math.round(baseValues.impressions(colleges) * mult.impressions);
      const posts = Math.round(baseValues.posts(colleges) * mult.posts);
      const media = Math.round(baseValues.media(colleges) * mult.media);

      animateValue(document.getElementById('res-students'), students);
      animateValue(document.getElementById('res-impressions'), impressions);
      animateValue(document.getElementById('res-posts'), posts);
      animateValue(document.getElementById('res-media'), media);
    }

    // Tier buttons
    document.querySelectorAll('.tier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTier = btn.dataset.tier;
        updateROI();
      });
    });

    // Slider
    const slider = document.getElementById('campusSlider');
    const campusValue = document.getElementById('campusValue');

    if (slider && campusValue) {
      slider.addEventListener('input', () => {
        currentColleges = parseInt(slider.value);
        campusValue.textContent = `${currentColleges} Colleges`;
        updateROI();
      });
    }

    // Initial render
    updateROI();
  }

  /* --- 9. WAX SEAL STAMP ANIMATION --- */
  const waxSeal = document.getElementById('waxSeal');
  let sealStamped = false;

  if (waxSeal) {
    const sealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !sealStamped) {
          sealStamped = true;

          // Small delay for dramatic effect
          setTimeout(() => {
            waxSeal.classList.add('stamped');
          }, 300);
        }
      });
    }, { threshold: 0.5 });

    sealObserver.observe(waxSeal);

    // On click — re-stamp with a fresh animation
    waxSeal.addEventListener('click', () => {
      waxSeal.classList.remove('stamped');
      waxSeal.offsetHeight; // force reflow
      setTimeout(() => {
        waxSeal.classList.add('stamped');
      }, 50);
    });
  }
});
