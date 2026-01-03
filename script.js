document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Initialization (Consolidated) ---
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && nav) {
        // Mobile Menu Toggle
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }

    // Sticky Header
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Active Link and Scroll Logic ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('#')[0] || 'index.html';
        const linkHash = '#' + (link.getAttribute('href').split('#')[1] || '');

        if (currentPath === 'despre.html' && link.dataset.page === 'despre.html') {
            link.classList.add('active');
        } else if (currentPath === 'servicii.html' && link.dataset.page === 'servicii.html') {
            link.classList.add('active');
        } else if (currentPath === 'produse.html' && link.dataset.page === 'produse.html') {
            link.classList.add('active');
        } else if (link.getAttribute('href').includes('index.html#servicii') &&
            (currentPath.includes('consiliere') || currentPath.includes('situatie'))) {
            link.classList.add('active');
        }
    });

    // Smooth Scroll and Scroll Spy (mostly for index.html)
    if (currentPath === 'index.html' || currentPath === '' || currentPath === '/') {
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href').split('#')[1];
            if (targetId) {
                link.addEventListener('click', (e) => {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        history.pushState(null, null, `#${targetId}`);
                    }
                });
            }
        });

        // Scroll Spy
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            const headerHeight = header ? header.offsetHeight : 0;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 150; // Increased offset for better spy
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHash = link.getAttribute('href').split('#')[1];
                if (linkHash === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Generic Smooth Scroll for internal links (other than nav)
    document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                let headerOffset = 100;
                if (targetId === '#servicii' || targetId === '#programeaza') {
                    headerOffset = -20;
                }
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    window.initializeAnimations = function () {
        const animatedElements = document.querySelectorAll('.animate-init');
        animatedElements.forEach(el => observer.observe(el));
    };

    window.initializeAnimations();

    // Custom Dropdown Logic
    function initializeCustomDropdowns() {
        const selects = document.querySelectorAll('select.form-control');

        selects.forEach(select => {
            // Check if already initialized to avoid duplicates
            if (select.nextElementSibling && select.nextElementSibling.classList.contains('custom-select')) return;

            const wrapper = document.createElement('div');
            wrapper.classList.add('custom-select-wrapper');
            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(select);

            select.style.display = 'none';

            const customSelect = document.createElement('div');
            customSelect.classList.add('custom-select');

            const trigger = document.createElement('div');
            trigger.classList.add('custom-select-trigger');
            trigger.textContent = select.options[select.selectedIndex].text || 'Alege...';
            customSelect.appendChild(trigger);

            const options = document.createElement('div');
            options.classList.add('custom-options');

            Array.from(select.options).forEach(option => {
                if (option.disabled) return; // Skip disabled 'placeholder' options if desired, or style them differently

                const customOption = document.createElement('div');
                customOption.classList.add('custom-option');
                customOption.dataset.value = option.value;
                customOption.textContent = option.text;

                if (option.selected) {
                    customOption.classList.add('selected');
                }

                customOption.addEventListener('click', () => {
                    select.value = option.value;
                    select.dispatchEvent(new Event('change')); // Trigger change event for listeners
                    trigger.textContent = option.text;

                    customSelect.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                    customOption.classList.add('selected');
                    customSelect.classList.remove('open');
                });

                options.appendChild(customOption);
            });

            customSelect.appendChild(options);
            wrapper.appendChild(customSelect);

            trigger.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent closing immediately
                // Close other open selects
                document.querySelectorAll('.custom-select').forEach(s => {
                    if (s !== customSelect) s.classList.remove('open');
                });
                customSelect.classList.toggle('open');
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-select')) {
                document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
            }
        });
    }

    initializeCustomDropdowns();

    // Appointment Form Submission
    const appointmentForm = document.getElementById('appointmentForm');
    const formFeedback = document.getElementById('formFeedback');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(appointmentForm);
            const data = Object.fromEntries(formData.entries());

            // Format labels for Discord
            const labels = {
                name: 'Nume',
                phone: 'Telefon',
                time: 'Momentul Zilei',
                urgency: 'Când dorește',
                meeting_type: 'Tip Întâlnire',
                service: 'Serviciu'
            };

            const formattedData = Object.keys(data).map(key => `**${labels[key] || key}:** ${data[key]}`).join('\n');
            const discordBody = {
                content: `🚀 **Solicitare nouă de programare**\n\n${formattedData}`
            };

            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Se trimite...';

            if (formFeedback) {
                formFeedback.style.display = 'none';
                formFeedback.className = 'form-feedback';
            }

            try {
                const response = await fetch('https://discord.com/api/webhooks/1454099935594024962/xu6mrgw8mHVrFJpQmdyZ4hgxnTf1t_HMEd2EMix9Gfnbm-QxbT0B6bg8dS4iAPLfqB6F', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(discordBody)
                });

                if (response.ok) {
                    appointmentForm.reset();
                    if (formFeedback) {
                        formFeedback.textContent = 'Mulțumesc! Solicitarea ta a fost trimisă. Te voi contacta în curând.';
                        formFeedback.classList.add('success');
                        formFeedback.style.display = 'block';
                        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } else {
                    throw new Error('Eroare la trimitere');
                }
            } catch (error) {
                if (formFeedback) {
                    formFeedback.textContent = 'Ne pare rău, a apărut o eroare. Te rugăm să ne contactezi telefonic.';
                    formFeedback.classList.add('error');
                    formFeedback.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Trimite Solicitarea';
            }
        });
    }

    // Accordion functionality for FAQ section
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
            const icon = header.querySelector('.icon');
            icon.textContent = item.classList.contains('active') ? '-' : '+';
        });
    });

});
