document.addEventListener('DOMContentLoaded', () => {

    /* --- CUSTOM CURSOR --- */
    const cursor = document.querySelector('.cursor');
    const hoverElements = document.querySelectorAll('a, button, .card, .tier-row, .platform');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });
    });

    // Hide default cursor site-wide except on mobile
    if (window.innerWidth > 768) {
        document.body.style.cursor = 'none';
        hoverElements.forEach(el => {
            el.style.cursor = 'none';
        });
    } else {
        cursor.style.display = 'none'; // hide custom cursor on mobile touch screens
    }


    /* --- STICKY NAVBAR & ACTIVE LINKS --- */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    /* --- COLOR DELIVERABLES TABLE SYMBOLS --- */
    const tds = document.querySelectorAll('.custom-table td');
    tds.forEach(td => {
        if (td.textContent.trim() === '✦') {
            td.style.color = 'var(--red)';
        } else if (td.textContent.trim() === '—') {
            td.style.color = 'var(--muted)';
        } else if (td.textContent.trim() === 'OPT') {
            td.style.color = 'var(--white)';
            td.style.fontStyle = 'italic';
            td.style.fontSize = '0.7rem';
        }
    });


    /* --- INITIAL HERO ANIMATION --- */
    setTimeout(() => {
        const lines = document.querySelectorAll('.hero-title .line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, index * 200);
        });

        document.querySelector('.hero-divider').classList.add('visible');
        
        const taglines = document.querySelectorAll('.fade-in-tagline');
        taglines.forEach(tag => tag.classList.add('visible'));

    }, 300); // slight delay after load


    /* --- SCROLL ANIMATIONS (INTERSECTION OBSERVER) --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                el.classList.add('visible');

                // Handle stagger children explicitly (e.g. cards, tiers)
                if (el.classList.contains('cards-grid') || el.classList.contains('tiers-container') || el.classList.contains('contact-cards')) {
                    const staggers = el.querySelectorAll('.reveal-fade-stagger, .reveal-slide-left');
                    staggers.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 150);
                    });
                }
                
                // Count up animation for stats
                if (el.classList.contains('stat-number') && !el.classList.contains('counted')) {
                    el.classList.add('counted');
                    const target = parseInt(el.getAttribute('data-target'));
                    let count = 0;
                    const duration = 2000;
                    const interval = duration / target;
                    
                    const updateCount = () => {
                        if (count < target) {
                            count++;
                            el.innerText = count;
                            setTimeout(updateCount, interval);
                        } else {
                            el.innerText = target;
                        }
                    };
                    updateCount();
                }

                obs.unobserve(el); // only animate once
            }
        });
    }, observerOptions);

    // Elements to observe
    const elementsToObserve = document.querySelectorAll(`
        .reveal-slide-right, 
        .reveal-slide-left, 
        .reveal-fade, 
        .reveal-fade-stagger,
        .reveal-fade-table,
        .accent-expand, 
        .accent-expand-left,
        .accent-expand-vertical,
        .stat-divider,
        .cards-grid,
        .tiers-container,
        .contact-cards,
        .stat-number,
        .reveal-sweep-right,
        .reveal-letter-space
    `);

    elementsToObserve.forEach(el => observer.observe(el));

});
