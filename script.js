document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Initialization (Consolidated) ---
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const navOverlay = document.getElementById('nav-overlay');
    const navClose = document.getElementById('nav-close');

    function closeMenu() {
        if (hamburger) hamburger.classList.remove('open');
        if (nav) nav.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
    }

    function toggleMenu() {
        if (hamburger) hamburger.classList.toggle('open');
        if (nav) nav.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

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
                time: 'Interval orar preferat',
                urgency: 'Când dorește',
                meeting_type: 'Tip Întâlnire',
                service: 'Serviciu',
                mentions: 'Mențiuni sau alte informații'
            };

            const formattedData = Object.keys(data).map(key => `**${labels[key] || key}:** ${data[key]}`).join('\n');

            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Se trimite...';

            if (formFeedback) {
                formFeedback.style.display = 'none';
                formFeedback.className = 'form-feedback';
            }

            try {
                // Fetch user's IP address
                let userIP = 'Unknown';
                try {
                    const ipResponse = await fetch('https://api.ipify.org?format=json');
                    const ipData = await ipResponse.json();
                    userIP = ipData.ip;
                } catch (ipError) {
                    console.log('Could not fetch IP:', ipError);
                }

                // Add IP to the formatted data
                const formattedDataWithIP = formattedData + `\n**🌐 IP Address:** ${userIP}`;
                const discordBody = {
                    content: `🚀 **Solicitare nouă de programare**\n\n${formattedDataWithIP}`
                };

                const response = await fetch('https://discord.com/api/webhooks/1454099935594024962/xu6mrgw8mHVrFJpQmdyZ4hgxnTf1t_HMEd2EMix9Gfnbm-QxbT0B6bg8dS4iAPLfqB6F', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(discordBody)
                });

                if (response.ok) {
                    if (formFeedback) {
                        // Check if we are on the incepe.html page to redirect to Step 2
                        const isIncepePage = window.location.pathname.includes('incepe.html');

                        if (isIncepePage) {
                            appointmentForm.style.opacity = '0';
                            setTimeout(() => {
                                appointmentForm.innerHTML = `
                                    <div class="form-feedback success" style="display: block;">
                                        <h3 style="color: #445c27; margin-bottom: 15px;">Solicitare Trimisă!</h3>
                                        <p>Mulțumesc! Solicitarea ta a fost primită. Te redirecționăm acum către următoarea etapă...</p>
                                    </div>
                                `;
                                appointmentForm.style.opacity = '1';

                                // Redirect to Step 3 (Questionnaire section) after 2 seconds
                                setTimeout(() => {
                                    window.location.href = '#questionnaire-step';
                                }, 2000);
                            }, 300);
                        } else {
                            // Default success behavior for index.html or other pages
                            appointmentForm.style.opacity = '0';
                            setTimeout(() => {
                                appointmentForm.innerHTML = `
                                    <div class="form-feedback success" style="display: block;">
                                        <h3 style="color: #445c27; margin-bottom: 15px;">Solicitare Trimisă!</h3>
                                        <p>Mulțumesc! Solicitarea ta a fost trimisă cu succes. Te voi contacta în cel mai scurt timp pentru a stabili detaliile.</p>
                                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;">
                                        <p style="font-size: 0.95rem;">Pentru a mă ajuta să pregătesc prima noastră întâlnire, te invit să completezi un scurt chestionar (opțional):</p>
                                        <a href="Chestionar/index.html" class="btn btn-primary" style="margin-top: 10px; display: inline-block;">Completează chestionarul</a>
                                    </div>
                                    <!-- Event snippet for Page view conversion page -->
                                `;
                                if (typeof gtag !== 'undefined') {
                                    gtag('event', 'conversion', { 'send_to': 'AW-17020203268/UndSCPfzursaEITi7rM_', 'value': 1.0, 'currency': 'RON' });
                                }
                                appointmentForm.style.opacity = '1';
                            }, 300);
                        }
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

    // Load More / Show Less functionality for Psychologist Q&A
    const loadMoreBtn = document.getElementById('qa-load-more');
    const showLessBtn = document.getElementById('qa-show-less');

    if (loadMoreBtn && showLessBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.qa-hidden');
            hiddenItems.forEach(item => {
                item.style.display = 'block';
                // Optional: Insert a small timeout or class addition for fade-in effect if CSS allows
                setTimeout(() => item.style.opacity = '1', 10);
            });
            loadMoreBtn.style.display = 'none';
            showLessBtn.style.display = 'inline-block';
        });

        showLessBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.qa-hidden');
            hiddenItems.forEach(item => {
                item.style.display = 'none';
                item.style.opacity = '0'; // Reset opacity for fade-in next time
            });
            showLessBtn.style.display = 'none';
            loadMoreBtn.style.display = 'inline-block';

            // Optional: Scroll slightly up if needed, but for now just toggle
        });
    }

    // Question Form Submission
    const questionForm = document.getElementById('questionForm');
    const questionFeedback = document.getElementById('questionFeedback');

    if (questionForm) {
        questionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(questionForm);
            const data = Object.fromEntries(formData.entries());

            const discordBody = {
                content: `❓ **Întrebare nouă de pe site**\n\n${data.question}`
            };

            const submitBtn = questionForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Se trimite...';

            if (questionFeedback) {
                questionFeedback.style.display = 'none';
                questionFeedback.className = 'form-feedback';
            }

            try {
                const response = await fetch('https://discord.com/api/webhooks/1454099935594024962/xu6mrgw8mHVrFJpQmdyZ4hgxnTf1t_HMEd2EMix9Gfnbm-QxbT0B6bg8dS4iAPLfqB6F', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(discordBody)
                });

                if (response.ok) {
                    questionForm.reset();
                    if (questionFeedback) {
                        questionFeedback.textContent = 'Întrebarea ta a fost trimisă cu succes! Îți voi răspunde curând.';
                        questionFeedback.classList.add('success');
                        questionFeedback.style.display = 'block';
                    }
                } else {
                    throw new Error('Eroare la trimitere');
                }
            } catch (error) {
                if (questionFeedback) {
                    questionFeedback.textContent = 'Eroare la trimiterea întrebării. Te rog încearcă din nou.';
                    questionFeedback.classList.add('error');
                    questionFeedback.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

});
