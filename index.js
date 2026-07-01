document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------
    // CURSOR GLOW EFFECT
    // -------------------------------------------------------------
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    // -------------------------------------------------------------
    // STICKY HEADER — scroll styling
    // -------------------------------------------------------------
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // -------------------------------------------------------------
    // MOBILE HAMBURGER MENU
    // -------------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    const navOverlay = document.getElementById('nav-overlay');

    const toggleMenu = () => {
        const isOpen = mainNav.classList.toggle('open');
        hamburger.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMenu);
    }

    // Close menu when a nav link is clicked
    document.querySelectorAll('.main-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // -------------------------------------------------------------
    // SCROLL REVEAL
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal, .stagger-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // -------------------------------------------------------------
    // STATS — Circular Ring Animation + Count Up
    // -------------------------------------------------------------
    const statsSection = document.getElementById('stats-section');
    const circumference = 2 * Math.PI * 40; // r=40

    const animateRings = () => {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const pct = parseInt(card.getAttribute('data-ring-pct'), 10);
            const fill = card.querySelector('.stat-ring-fill');
            const offset = circumference - (pct / 100) * circumference;
            fill.style.strokeDashoffset = offset;
        });

        // Count up numbers
        const values = document.querySelectorAll('.stat-ring-value');
        values.forEach(el => {
            const target = parseInt(el.getAttribute('data-val'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            let current = 0;
            const duration = 1800;
            const stepTime = Math.max(Math.floor(duration / target), 40);

            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current + suffix;
            }, stepTime);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateRings();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) statsObserver.observe(statsSection);

    // -------------------------------------------------------------
    // SKILL BARS ANIMATION
    // -------------------------------------------------------------
    const skillBars = document.getElementById('skill-bars');
    const animateSkillBars = () => {
        const fills = document.querySelectorAll('.skill-bar-fill');
        fills.forEach(fill => {
            const w = fill.getAttribute('data-width');
            fill.style.width = w + '%';
        });
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (skillBars) skillObserver.observe(skillBars);

    // -------------------------------------------------------------
    // PROJECT FILTERING
    // -------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach((card, i) => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    }, i * 60);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // -------------------------------------------------------------
    // EMAIL COPY
    // -------------------------------------------------------------
    const btnCopy = document.getElementById('btn-copy');
    const emailAddress = document.getElementById('email-address');
    const toast = document.getElementById('toast');

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    if (btnCopy && emailAddress) {
        btnCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(emailAddress.textContent.trim())
                .then(() => {
                    const copyText = btnCopy.querySelector('.copy-text');
                    copyText.textContent = 'Copied!';
                    showToast('Email address copied.');
                    setTimeout(() => { copyText.textContent = 'Copy'; }, 2000);
                })
                .catch(() => showToast('Failed to copy.'));
        });
    }

    // -------------------------------------------------------------
    // CONTACT FORM
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(contactForm)
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    showToast('Inquiry sent! I will get back to you.');
                    contactForm.reset();
                } else {
                    showToast('Failed to send: ' + (data.message || 'Error.'));
                }
            })
            .catch(() => showToast('Connection error. Try emailing directly.'))
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // -------------------------------------------------------------
    // FOOTER LOCAL TIME
    // -------------------------------------------------------------
    const updateTime = () => {
        const links = document.querySelector('.footer-links');
        if (!links) return;
        let label = document.getElementById('ist-time');
        if (!label) {
            label = document.createElement('span');
            label.id = 'ist-time';
            label.className = 'mono-label';
            links.appendChild(label);
        }
        const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
        const ist = new Date(utc + 3600000 * 5.5);
        label.textContent = ist.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:false }) + ' IST';
    };
    updateTime();
    setInterval(updateTime, 1000);
});
