// script.js - General website scripting & validations

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggling
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    const closeMenu = () => {
        if (navMenu) navMenu.classList.remove('active');
        const icon = hamburger ? hamburger.querySelector('i') : null;
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close when clicking outside the nav menu
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !hamburger.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // Close menu when nav links are clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when mobile action buttons are clicked
    const mobileActionLinks = document.querySelectorAll('.nav-actions-mobile a');
    mobileActionLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 2. Sticky Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 4. Hero Background Slider (for index.html)
    const slides = document.querySelectorAll('.hero-section .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 5000; // 5 seconds
        
        // Initial setup
        slides[0].classList.add('active');

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        setInterval(nextSlide, slideInterval);
    }

    // 5. Testimonial Carousel (for index.html)
    const testimonialTrack = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.slider-dots .dot');
    if (testimonialTrack && dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Update dots active class
                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                // Move track
                testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
            });
        });
    }

    // 6. Accordion Toggling (for FAQ sections)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            
            // Toggle active state
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                // Close other open FAQ items if desired, or just toggle this one
                // Uncomment below if you want accordion behavior (only one open at a time)
                /*
                faqQuestions.forEach(q => {
                    q.parentElement.classList.remove('active');
                    q.nextElementSibling.style.maxHeight = null;
                });
                */
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // 7. Eye Mask Toggle for Passwords (Login & Register pages)
    const togglePasswords = document.querySelectorAll('.toggle-password');
    togglePasswords.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                // Toggle eye icon
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            }
        });
    });

    // 8. General Button Redirect to 404
    // Home page, About, Services, Blog, Contact, Dashboards: Any button should go to 404.html
    // Exclude navbar login, register, home routing, form submit buttons that process logic, logout.
    const allButtons = document.querySelectorAll('button, .btn-gradient, .btn-secondary, .btn-card, .course-footer a');
    allButtons.forEach(btn => {
        // Exclude specific functional buttons/actions
        if (btn.classList.contains('login-btn') || 
            btn.classList.contains('get-started-btn') ||
            btn.classList.contains('hamburger') ||
            btn.classList.contains('faq-question') ||
            btn.id === 'submit-register' ||
            btn.id === 'submit-login' ||
            btn.classList.contains('logout-btn') ||
            btn.classList.contains('toggle-password') ||
            btn.classList.contains('back-home-btn') ||
            btn.getAttribute('data-action') === 'submit'
        ) {
            return; // Skip redirection for system flow buttons
        }
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '404.html';
        });
    });

    // 9. Social Media Icon Redirection to 404.html
    const socialIcons = document.querySelectorAll('.social-icon, .social-icons a');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '404.html';
        });
    });

    // 10. Forms and Validations
    // Helper: Strong Password Validation
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const isStrongPassword = (pwd) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pwd);
    };

    // --- REGISTER PAGE VALIDATION ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('name-input');
            const emailInput = document.getElementById('email-input');
            const phoneInput = document.getElementById('phone-input');
            const passInput = document.getElementById('password-input');
            const confirmInput = document.getElementById('confirm-password-input');
            
            let isValid = true;

            // Name: Only alphabets/spaces, max 16 chars
            const nameVal = nameInput.value.trim();
            const nameErr = document.getElementById('error-name');
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (nameVal === '' || !nameRegex.test(nameVal) || nameVal.length > 16) {
                nameErr.textContent = 'Name must contain only alphabets and be maximum 16 characters.';
                nameErr.style.display = 'block';
                nameInput.parentElement.classList.add('error-border');
                isValid = false;
            } else {
                nameErr.style.display = 'none';
                nameInput.parentElement.classList.remove('error-border');
            }

            // Email: Format check
            const emailVal = emailInput.value.trim();
            const emailErr = document.getElementById('error-email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                emailErr.textContent = 'Please enter a valid email address.';
                emailErr.style.display = 'block';
                emailInput.parentElement.classList.add('error-border');
                isValid = false;
            } else {
                emailErr.style.display = 'none';
                emailInput.parentElement.classList.remove('error-border');
            }

            // Mobile: Exactly 10 digits
            const phoneVal = phoneInput.value.trim();
            const phoneErr = document.getElementById('error-phone');
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phoneVal)) {
                phoneErr.textContent = 'Mobile number must contain exactly 10 digits.';
                phoneErr.style.display = 'block';
                phoneInput.parentElement.classList.add('error-border');
                isValid = false;
            } else {
                phoneErr.style.display = 'none';
                phoneInput.parentElement.classList.remove('error-border');
            }

            // Password: Strong Password Check
            const passVal = passInput.value;
            const passErr = document.getElementById('error-password');
            if (!isStrongPassword(passVal)) {
                passErr.textContent = 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.';
                passErr.style.display = 'block';
                passInput.parentElement.classList.add('error-border');
                isValid = false;
            } else {
                passErr.style.display = 'none';
                passInput.parentElement.classList.remove('error-border');
            }

            // Confirm Password: Match Check
            const confirmVal = confirmInput.value;
            const confirmErr = document.getElementById('error-confirm');
            if (confirmVal !== passVal || confirmVal === '') {
                confirmErr.textContent = 'Passwords do not match.';
                confirmErr.style.display = 'block';
                confirmInput.parentElement.classList.add('error-border');
                isValid = false;
            } else {
                confirmErr.style.display = 'none';
                confirmInput.parentElement.classList.remove('error-border');
            }

            if (isValid) {
                // Mock registration by storing users in localStorage
                const users = JSON.parse(localStorage.getItem('users')) || [];
                // Check if user exists
                const userExists = users.some(u => u.email === emailVal);
                if (userExists) {
                    emailErr.textContent = 'An account with this email already exists.';
                    emailErr.style.display = 'block';
                    emailInput.parentElement.classList.add('error-border');
                    return;
                }

                // Add to local storage
                users.push({
                    name: nameVal,
                    email: emailVal,
                    phone: phoneVal,
                    password: passVal,
                    role: 'user' // Default role for registrations
                });
                localStorage.setItem('users', JSON.stringify(users));

                alert('Account created successfully! Please log in.');
                window.location.href = 'login.html';
            }
        });
    }

    // --- LOGIN PAGE VALIDATION ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email-input');
            const passInput = document.getElementById('password-input');
            const roleSelect = document.getElementById('role-select');
            
            let isValid = true;

            // Email check
            const emailVal = emailInput.value.trim();
            const emailErr = document.getElementById('error-email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                emailErr.textContent = 'Please enter a valid email address.';
                emailErr.style.display = 'block';
                emailInput.parentElement.classList.add('error-border');
                isValid = false;
            } else {
                emailErr.style.display = 'none';
                emailInput.parentElement.classList.remove('error-border');
            }

            // Password check
            const passVal = passInput.value;
            const passErr = document.getElementById('error-password');
            if (!isStrongPassword(passVal)) {
                passErr.textContent = 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.';
                passErr.style.display = 'block';
                passInput.parentElement.classList.add('error-border');
                isValid = false;
            } else {
                passErr.style.display = 'none';
                passInput.parentElement.classList.remove('error-border');
            }

            if (isValid) {
                const selectedRole = roleSelect.value;
                
                // MOCK authentication
                // Admin logic: bypass registration, checks predefined credentials or allows simple validation
                if (selectedRole === 'admin') {
                    if (emailVal === 'admin@stackly.com' && passVal === 'Admin@123') {
                        // Predefined mock admin
                        localStorage.setItem('currentUser', JSON.stringify({ email: emailVal, role: 'admin', name: 'Stackly Admin' }));
                        window.location.href = 'dashboard-admin.html';
                    } else {
                        // For demo convenience, also check if admin account was created or just alert the exact credentials
                        alert('Demo Admin Credentials: \nEmail: admin@stackly.com \nPassword: Admin@123');
                        passErr.textContent = 'Incorrect credentials. Use Email: admin@stackly.com and Password: Admin@123';
                        passErr.style.display = 'block';
                    }
                } else {
                    // User checking
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const user = users.find(u => u.email === emailVal && u.password === passVal);
                    
                    if (user) {
                        localStorage.setItem('currentUser', JSON.stringify({ email: user.email, role: 'user', name: user.name }));
                        window.location.href = 'dashboard-user.html';
                    } else {
                        // Predefined mock user for easy testing
                        if (emailVal === 'user@stackly.com' && passVal === 'User@1234') {
                            localStorage.setItem('currentUser', JSON.stringify({ email: emailVal, role: 'user', name: 'John Doe' }));
                            window.location.href = 'dashboard-user.html';
                        } else {
                            alert('User not found. Try registering, or log in with demo account:\nEmail: user@stackly.com\nPassword: User@1234');
                            passErr.textContent = 'Incorrect email or password.';
                            passErr.style.display = 'block';
                        }
                    }
                }
            }
        });
    }

    // --- LOGOUT LOGIC ---
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(logoutBtn => {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    });
});
