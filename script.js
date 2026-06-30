document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.addEventListener('click', (e) => {
        if(e.target.tagName === 'A') {
            navLinks.classList.remove('active');
        }
    });

    // Scroll Animations (Intersection Observer)
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counters if the element contains any
                if (!entry.target.dataset.counted) {
                    const counters = entry.target.querySelectorAll('.counter');
                    if (counters.length > 0) {
                        counters.forEach(counter => animateCounter(counter));
                        entry.target.dataset.counted = true;
                    }
                }
            } else {
                // Re-animate pricing cards when scrolled back into view
                if (entry.target.classList.contains('price-card') || entry.target.classList.contains('stat-item')) {
                    entry.target.classList.remove('visible');
                }

                // Reset counters when out of view to re-animate next time
                if (entry.target.dataset.counted === "true") {
                    entry.target.dataset.counted = '';
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        counter.innerText = '0' + (counter.getAttribute('data-suffix') || '');
                    });
                }
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(el => observer.observe(el));

    // Zigzag Slide-in Animations
    const slideElements = document.querySelectorAll('.slide-in-left, .slide-in-right');
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    slideElements.forEach(el => slideObserver.observe(el));

    // Parallax on Scroll
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    if (parallaxBgs.length > 0) {
        window.addEventListener('scroll', () => {
            parallaxBgs.forEach(bg => {
                const section = bg.parentElement;
                const rect = section.getBoundingClientRect();
                const speed = 0.4;
                bg.style.transform = `translateY(${rect.top * speed}px)`;
            });
        });
    }

    // Counter Animation
    function animateCounter(counterElement) {
        const target = +counterElement.getAttribute('data-target');
        const suffix = counterElement.getAttribute('data-suffix') || '';
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counterElement.innerText = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.innerText = target + suffix;
            }
        };

        updateCounter();
    }

    // BMI Calculator
    const bmiForm = document.getElementById('bmi-form');
    const bmiResult = document.getElementById('bmi-result');
    const bmiRefresh = document.getElementById('bmi-refresh');

    if(bmiRefresh) {
        bmiRefresh.addEventListener('click', () => {
            bmiRefresh.classList.remove('spinning', 'animating');
            void bmiRefresh.offsetWidth; // trigger reflow
            bmiRefresh.classList.add('spinning', 'animating');
            setTimeout(() => {
                bmiRefresh.classList.remove('spinning', 'animating');
            }, 800);
            
            if(bmiForm) bmiForm.reset();
            if(bmiResult) {
                bmiResult.style.display = 'none';
                bmiResult.innerHTML = '';
            }
        });
    }

    if(bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('bmi-weight').value);
            const heightCm = parseFloat(document.getElementById('bmi-height').value);
            
            if (weight > 0 && heightCm > 0) {
                const heightM = heightCm / 100;
                const bmi = (weight / (heightM * heightM)).toFixed(1);
                
                let category = '';
                if (bmi < 18.5) category = 'Underweight';
                else if (bmi < 24.9) category = 'Normal Weight';
                else if (bmi < 29.9) category = 'Overweight';
                else category = 'Obese';

                bmiResult.innerHTML = `<h4>${bmi}</h4><p>${category}</p>`;
                bmiResult.style.display = 'block';
            }
        });
    }

    // Gender Toggle
    const genderToggle = document.getElementById('gender-toggle');
    const genderBtns = document.querySelectorAll('.gender-btn');
    const genderInput = document.getElementById('cal-gender');

    if (genderToggle) {
        genderBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                genderBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const gender = btn.getAttribute('data-gender');
                genderInput.value = gender;
                if (gender === 'F') {
                    genderToggle.classList.add('female');
                } else {
                    genderToggle.classList.remove('female');
                }
            });
        });
    }

    // Calorie Calculator (Simplified BMR Harris-Benedict)
    const calForm = document.getElementById('cal-form');
    const calResult = document.getElementById('cal-result');
    const calRefresh = document.getElementById('cal-refresh');

    if(calRefresh) {
        calRefresh.addEventListener('click', () => {
            calRefresh.classList.remove('spinning', 'animating');
            void calRefresh.offsetWidth; // trigger reflow
            calRefresh.classList.add('spinning', 'animating');
            setTimeout(() => {
                calRefresh.classList.remove('spinning', 'animating');
            }, 800);
            
            if(calForm) calForm.reset();
            
            // Reset gender toggle
            if (genderToggle && genderBtns.length > 0 && genderInput) {
                genderBtns.forEach(b => b.classList.remove('active'));
                genderBtns[0].classList.add('active');
                genderToggle.classList.remove('female');
                genderInput.value = 'M';
            }

            if(calResult) {
                calResult.style.display = 'none';
                calResult.innerHTML = '';
            }
        });
    }

    if(calForm) {
        calForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const age = parseInt(document.getElementById('cal-age').value);
            const gender = document.getElementById('cal-gender').value.toUpperCase();
            
            if (age > 0 && (gender === 'M' || gender === 'F')) {
                // Simplified baseline since we don't have weight/height in this form
                // Just for demo purposes. Real calculator needs full metrics.
                let baseCalories = gender === 'M' ? 2500 : 2000;
                
                if (age > 40) baseCalories -= 200;
                if (age < 20) baseCalories += 200;

                calResult.innerHTML = `<h4>~${baseCalories} kcal</h4><p>Estimated Maintenance</p>`;
                calResult.style.display = 'block';
            }
        });
    }

    // Lightbox for Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    if (lightbox && galleryItems.length > 0) {
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Close on clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

});
