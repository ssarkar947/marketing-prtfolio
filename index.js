document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // SCROLL REVEAL ANIMATION
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // -------------------------------------------------------------
    // STATS COUNTING ANIMATION
    // -------------------------------------------------------------
    const statCards = document.querySelector('.stats-section');
    const statNums = document.querySelectorAll('.stat-num');
    
    const animateStats = () => {
        statNums.forEach(num => {
            const target = parseInt(num.getAttribute('data-val'), 10);
            let current = 0;
            const duration = 1200; // ms
            const stepTime = Math.max(Math.floor(duration / target), 15);
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Add suffix back depending on value
                if (target === 47) {
                    num.textContent = current + '+';
                } else if (target === 15) {
                    num.textContent = '$' + current + 'M+';
                } else if (target === 738) {
                    num.textContent = current + '+';
                } else {
                    num.textContent = current;
                }
            }, stepTime);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statCards) {
        statsObserver.observe(statCards);
    }

    // -------------------------------------------------------------
    // PROJECT FILTERING SYSTEM
    // -------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state in buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hide');
                    // Add subtle scaling reveal
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // -------------------------------------------------------------
    // EMAIL COPY TO CLIPBOARD
    // -------------------------------------------------------------
    const btnCopy = document.getElementById('btn-copy');
    const emailAddress = document.getElementById('email-address');
    const toast = document.getElementById('toast');

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    if (btnCopy && emailAddress) {
        btnCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(emailAddress.textContent.trim())
                .then(() => {
                    const copyText = btnCopy.querySelector('.copy-text');
                    copyText.textContent = 'Copied!';
                    btnCopy.style.borderColor = 'var(--accent)';
                    btnCopy.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                    btnCopy.style.color = 'var(--accent)';
                    
                    showToast('Direct email address copied to clipboard.');
                    
                    setTimeout(() => {
                        copyText.textContent = 'Copy';
                        btnCopy.style.borderColor = '';
                        btnCopy.style.backgroundColor = '';
                        btnCopy.style.color = '';
                    }, 2000);
                })
                .catch(err => {
                    showToast('Failed to copy email automatically.');
                    console.error('Copy failed: ', err);
                });
        });
    }

    // -------------------------------------------------------------
    // DIRECT INQUIRY FORM SUBMISSION (WEB3FORMS)
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            
            // Visual loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Inquiry sent successfully. I will get back to you shortly.');
                    contactForm.reset();
                } else {
                    showToast('Failed to send: ' + (data.message || 'Error occurred.'));
                }
            })
            .catch(err => {
                showToast('Connection error. Please try again or email directly.');
                console.error('Submission error:', err);
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // -------------------------------------------------------------
    // DYNAMIC LOCAL TIME (IST) DISPLAY
    // -------------------------------------------------------------
    const updateLocalTime = () => {
        const footerLinks = document.querySelector('.footer-links');
        if (!footerLinks) return;

        // Check if time label exists, if not create it
        let timeLabel = document.getElementById('ist-time-label');
        if (!timeLabel) {
            timeLabel = document.createElement('span');
            timeLabel.id = 'ist-time-label';
            timeLabel.className = 'mono-label';
            footerLinks.appendChild(timeLabel);
        }

        // Calculate Kolkata Time (UTC+5.5)
        const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
        const kolkataTime = new Date(utc + (3600000 * 5.5));
        
        const formatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        timeLabel.textContent = `LOC TIME // ${kolkataTime.toLocaleTimeString('en-US', formatOptions)} IST`;
    };

    // Update time every second
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
});
