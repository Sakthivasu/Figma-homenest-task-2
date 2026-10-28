/* =================================
   STACKLY PRELOADER - INDEX PAGE
================================= */

(() => {
    const preloader = document.getElementById("preloader");

   
    if (!preloader || preloader.dataset.initialized === "true") return;

    preloader.dataset.initialized = "true";

    const fill = document.getElementById("progressFill");
    const percent = document.getElementById("progressPercent");
    const ring = document.getElementById("loaderRingProgress");

    const circumference = 2 * Math.PI * 70;

    let currentProgress = 0;
    let pageLoaded = document.readyState === "complete";
    let hidden = false;
    let navigationStarted = false;

    if (ring) {
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;
    }

    function updateProgress(value) {
        currentProgress = Math.max(
            currentProgress,
            Math.min(100, value)
        );

        if (fill) {
            fill.style.width = currentProgress + "%";
        }

        if (percent) {
            percent.textContent =
                Math.round(currentProgress) + "%";
        }

        if (ring) {
            ring.style.strokeDashoffset =
                circumference * (1 - currentProgress / 100);
        }
    }

    function hidePreloader() {
        if (hidden) return;

        hidden = true;
        updateProgress(100);

        setTimeout(() => {
            preloader.classList.add("is-hidden");
        }, 250);
    }

    // Loading progress animation
    const startTime = performance.now();
    const minimumDuration = 1200;

    function animateLoading(now) {
        if (hidden || navigationStarted) return;

        const elapsed = now - startTime;

        // Page fully load ஆகும் வரை 90% வரை மட்டும்
        const visualProgress = Math.min(
            90,
            (elapsed / minimumDuration) * 90
        );

        updateProgress(visualProgress);

        if (pageLoaded) {
            hidePreloader();
            return;
        }

        requestAnimationFrame(animateLoading);
    }

    window.addEventListener("load", () => {
        pageLoaded = true;

        if (!navigationStarted) {
            hidePreloader();
        }
    }, { once: true });

    requestAnimationFrame(animateLoading);

    // Local HTML page links-ஐ click செய்யும்போது transition
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");

        if (!link) return;
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.ctrlKey || event.metaKey ||
            event.shiftKey || event.altKey) return;

        if (link.target && link.target !== "_self") return;
        if (link.hasAttribute("download")) return;

        const href = link.getAttribute("href");

        if (!href || href.startsWith("#")) return;
        if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

        let destination;

        try {
            destination = new URL(href, window.location.href);
        } catch {
            return;
        }

        if (destination.origin !== window.location.origin) return;

        if (destination.href === window.location.href) return;

        event.preventDefault();
        navigationStarted = true;

        preloader.classList.remove("is-hidden");
        updateProgress(0);

        const transitionStart = performance.now();
        const transitionDuration = 650;

        function animateTransition(now) {
            const fraction = Math.min(
                (now - transitionStart) / transitionDuration,
                1
            );

            const eased = 1 - Math.pow(1 - fraction, 2);

            updateProgress(eased * 100);

            if (fraction < 1) {
                requestAnimationFrame(animateTransition);
            } else {
                window.location.href = destination.href;
            }
        }

        requestAnimationFrame(animateTransition);
    });
})();
/* ==========================================
   STACKLY SIGN UP PAGE JAVASCRIPT
   Preloader logic is managed separately
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* 1. PASSWORD SHOW / HIDE */

    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (passwordInput && togglePassword) {
        togglePassword.setAttribute("role", "button");
        togglePassword.setAttribute("tabindex", "0");
        togglePassword.setAttribute("aria-label", "Show password");

        function togglePasswordVisibility() {
            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            togglePassword.classList.toggle(
                "fa-eye",
                !isPassword
            );

            togglePassword.classList.toggle(
                "fa-eye-slash",
                isPassword
            );

            togglePassword.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );
        }

        togglePassword.addEventListener(
            "click",
            togglePasswordVisibility
        );

        togglePassword.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                togglePasswordVisibility();
            }
        });
    }


    /* 2. FAVOURITE HEART */

    const wishlistBtn = document.getElementById("wishlistBtn");
    const wishlistCount = document.getElementById("wishlistCount");

    if (wishlistBtn && wishlistCount) {
        wishlistBtn.setAttribute("role", "button");
        wishlistBtn.setAttribute("tabindex", "0");
        wishlistBtn.setAttribute("aria-pressed", "false");
        wishlistBtn.setAttribute("aria-label", "Add to favourites");

        // Initial state: not favourited
        let isFavorite = false;

        function updateWishlist() {
            isFavorite = !isFavorite;

            wishlistBtn.classList.toggle(
                "is-favorite",
                isFavorite
            );

            wishlistBtn.setAttribute(
                "aria-pressed",
                String(isFavorite)
            );

            wishlistBtn.setAttribute(
                "aria-label",
                isFavorite
                    ? "Remove from favourites"
                    : "Add to favourites"
            );

            wishlistCount.textContent = isFavorite ? "1" : "0";
        }

        wishlistBtn.addEventListener("click", updateWishlist);

        wishlistBtn.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                updateWishlist();
            }
        });
    }


    /* 3. HEADER SCROLL EFFECT */

    const header = document.querySelector("header");

    if (header) {
        function updateHeader() {
            header.classList.toggle(
                "header-scrolled",
                window.scrollY > 15
            );
        }

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });

        updateHeader();
    }


    /* 4. SIGNUP FORM VALIDATION */

    const signupForm = document.querySelector(
        ".login-section form"
    );

    const fullNameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");

    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            let firstInvalidInput = null;

            const fields = [
                fullNameInput,
                emailInput,
                passwordInput
            ].filter(Boolean);

            fields.forEach((field) => {
                field.removeAttribute("aria-invalid");
                field.setCustomValidity("");
            });

            function markInvalid(field, message) {
                field.setAttribute("aria-invalid", "true");
                field.setCustomValidity(message);

                if (!firstInvalidInput) {
                    firstInvalidInput = field;
                }
            }

            if (fullNameInput) {
                const name = fullNameInput.value.trim();

                if (name.length < 2) {
                    markInvalid(
                        fullNameInput,
                        "Please enter your full name."
                    );
                }
            }

            if (emailInput) {
                const contact = emailInput.value.trim();

                const validEmail =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

                const validMobile =
                    /^\+?[0-9\s()-]{7,18}$/.test(contact) &&
                    (contact.match(/\d/g) || []).length >= 7;

                if (!validEmail && !validMobile) {
                    markInvalid(
                        emailInput,
                        "Please enter a valid email address or mobile number."
                    );
                }
            }

            if (passwordInput) {
                if (passwordInput.value.length < 8) {
                    markInvalid(
                        passwordInput,
                        "Password must contain at least 8 characters."
                    );
                }
            }

            if (firstInvalidInput) {
                event.preventDefault();
                firstInvalidInput.reportValidity();
                firstInvalidInput.focus();
            }

            /*
             * If validation succeeds, the existing form action
             * proceeds to login.html using GET.
             *
             * For real account creation, connect a backend API.
             */
        });

        // Clear custom errors while the user corrects input.
        [fullNameInput, emailInput, passwordInput]
            .filter(Boolean)
            .forEach((field) => {
                field.addEventListener("input", () => {
                    field.removeAttribute("aria-invalid");
                    field.setCustomValidity("");
                });
            });
    }


    /* 5. SOCIAL LINKS: OPEN SAFELY */

    document.querySelectorAll(
        '.social-login a[target="_blank"]'
    ).forEach((link) => {
        link.setAttribute("rel", "noopener noreferrer");
    });

});
/* ==================================================
   STACKLY REAL ESTATE - COMMON MAIN.JS
   Preloader + Navigation + Login + Signup Controls
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ----------------------------------------------
       1. COMMON PRELOADER
    ---------------------------------------------- */

    const preloader = document.getElementById("preloader");
    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");
    const progressRing = document.getElementById("loaderRingProgress");

    let isNavigating = false;
    let isHidden = false;

    const ringCircumference = 2 * Math.PI * 70;

    function setProgress(value) {
        const progress = Math.max(0, Math.min(100, value));

        if (progressFill) {
            progressFill.style.width = progress + "%";
        }

        if (progressPercent) {
            progressPercent.textContent = Math.round(progress) + "%";
        }

        if (progressRing) {
            progressRing.style.strokeDasharray = ringCircumference;
            progressRing.style.strokeDashoffset =
                ringCircumference * (1 - progress / 100);
        }
    }

    function showPreloader() {
        if (!preloader) return;

        isHidden = false;
        preloader.classList.remove("is-hidden");
        setProgress(0);
    }

    function hidePreloader() {
        if (!preloader || isHidden) return;

        isHidden = true;
        setProgress(100);

        window.setTimeout(() => {
            preloader.classList.add("is-hidden");
        }, 250);
    }

    if (preloader) {
        setProgress(0);

        const startTime = performance.now();
        const minimumLoadingTime = 1000;
        let pageIsLoaded = document.readyState === "complete";

        function loadingAnimation(now) {
            if (isNavigating || isHidden) return;

            const elapsed = now - startTime;

            // Loading animation: 0% to 90%.
            const progress = Math.min(
                90,
                (elapsed / minimumLoadingTime) * 90
            );

            setProgress(progress);

            if (pageIsLoaded) {
                hidePreloader();
                return;
            }

            requestAnimationFrame(loadingAnimation);
        }

        window.addEventListener("load", () => {
            pageIsLoaded = true;

            if (!isNavigating) {
                hidePreloader();
            }
        }, { once: true });

        requestAnimationFrame(loadingAnimation);
    }


    /* ----------------------------------------------
       2. PAGE NAVIGATION WITH PRELOADER
    ---------------------------------------------- */

    function navigateWithPreloader(destination) {
        if (!destination) return;

        if (!preloader) {
            window.location.href = destination;
            return;
        }

        if (isNavigating) return;

        isNavigating = true;
        showPreloader();

        const start = performance.now();
        const duration = 700;

        function transitionAnimation(now) {
            const fraction = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - fraction, 2);

            setProgress(eased * 100);

            if (fraction < 1) {
                requestAnimationFrame(transitionAnimation);
            } else {
                window.location.href = destination;
            }
        }

        requestAnimationFrame(transitionAnimation);
    }

    /* ----------------------------------------------
       3. PASSWORD SHOW / HIDE
    ---------------------------------------------- */

    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (passwordInput && togglePassword) {
        togglePassword.setAttribute("role", "button");
        togglePassword.setAttribute("tabindex", "0");
        togglePassword.setAttribute("aria-label", "Show password");

        function togglePasswordVisibility() {
            const show = passwordInput.type === "password";

            passwordInput.type = show ? "text" : "password";

            togglePassword.classList.toggle("fa-eye", !show);
            togglePassword.classList.toggle("fa-eye-slash", show);

            togglePassword.setAttribute(
                "aria-label",
                show ? "Hide password" : "Show password"
            );
        }

        togglePassword.addEventListener(
            "click",
            togglePasswordVisibility
        );

        togglePassword.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                togglePasswordVisibility();
            }
        });
    }


    /* ----------------------------------------------
       4. FAVOURITE HEART
    ---------------------------------------------- */

    const wishlistButton = document.getElementById("wishlistBtn");
    const wishlistCount = document.getElementById("wishlistCount");

    if (wishlistButton && wishlistCount) {
        wishlistButton.setAttribute("role", "button");
        wishlistButton.setAttribute("tabindex", "0");
        wishlistButton.setAttribute("aria-pressed", "false");
        wishlistButton.setAttribute("aria-label", "Add to favourites");

        let isFavorite = false;

        function toggleFavourite() {
            isFavorite = !isFavorite;

            wishlistButton.classList.toggle(
                "is-favorite",
                isFavorite
            );

            wishlistButton.setAttribute(
                "aria-pressed",
                String(isFavorite)
            );

            wishlistButton.setAttribute(
                "aria-label",
                isFavorite
                    ? "Remove from favourites"
                    : "Add to favourites"
            );

            wishlistCount.textContent = isFavorite ? "1" : "0";
        }

        wishlistButton.addEventListener("click", toggleFavourite);

        wishlistButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleFavourite();
            }
        });
    }


    /* ----------------------------------------------
       5. HEADER SCROLL EFFECT
    ---------------------------------------------- */

    const header = document.querySelector("header");

    if (header) {
        function updateHeader() {
            header.classList.toggle(
                "header-scrolled",
                window.scrollY > 15
            );
        }

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });

        updateHeader();
    }


    /* ----------------------------------------------
       6. LOGIN / SIGNUP FORM VALIDATION
    ---------------------------------------------- */

    const authForm = document.querySelector(".login-section form");

    const fullNameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");

    if (authForm) {
        authForm.addEventListener("submit", (event) => {
            const fields = [
                fullNameInput,
                emailInput,
                passwordInput
            ].filter(Boolean);

            let firstInvalid = null;

            fields.forEach((field) => {
                field.removeAttribute("aria-invalid");
                field.setCustomValidity("");
            });

            function markInvalid(field, message) {
                field.setAttribute("aria-invalid", "true");
                field.setCustomValidity(message);

                if (!firstInvalid) {
                    firstInvalid = field;
                }
            }

            // Signup page only
            if (fullNameInput) {
                if (fullNameInput.value.trim().length < 2) {
                    markInvalid(
                        fullNameInput,
                        "Please enter your full name."
                    );
                }
            }

            // Login and signup contact field
            if (emailInput) {
                const contact = emailInput.value.trim();

                const validEmail =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

                const validMobile =
                    /^\+?[0-9\s()-]{7,18}$/.test(contact) &&
                    (contact.match(/\d/g) || []).length >= 7;

                if (!validEmail && !validMobile) {
                    markInvalid(
                        emailInput,
                        "Enter a valid email address or mobile number."
                    );
                }
            }

            if (passwordInput && passwordInput.value.length < 8) {
                markInvalid(
                    passwordInput,
                    "Password must contain at least 8 characters."
                );
            }

            if (firstInvalid) {
                event.preventDefault();
                firstInvalid.reportValidity();
                firstInvalid.focus();
                return;
            }

            /*
             * Demo navigation:
             * After valid form input, use the form's existing
             * action and show the Preloader before navigation.
             *
             * This does not authenticate a real account.
             */
            const formAction = authForm.getAttribute("action");

            if (formAction && preloader) {
                event.preventDefault();

                const destination = new URL(
                    formAction,
                    window.location.href
                );

                navigateWithPreloader(destination.href);
            }
        });

        [fullNameInput, emailInput, passwordInput]
            .filter(Boolean)
            .forEach((field) => {
                field.addEventListener("input", () => {
                    field.removeAttribute("aria-invalid");
                    field.setCustomValidity("");
                });
            });
    }


    /* ----------------------------------------------
       7. FORGOT PASSWORD DEMO
    ---------------------------------------------- */

    const forgotPasswordLink = document.getElementById("openForgotModal");

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", (event) => {
            event.preventDefault();

            const email = window.prompt(
                "Enter your registered email address to request a password reset:"
            );

            if (email === null) return;

            const validEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

            if (!validEmail) {
                window.alert("Please enter a valid email address.");
                return;
            }

            window.alert(
                "This is a front-end demo. Connect a backend password-reset service to send a real reset link."
            );
        });
    }


    /* ----------------------------------------------
       8. SOCIAL LINKS
    ---------------------------------------------- */

    document.querySelectorAll(
        '.social-login a[target="_blank"]'
    ).forEach((link) => {
        link.setAttribute("rel", "noopener noreferrer");
    });

});
/* =========================================================
   STACKLY REAL ESTATE - HOMEPAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initMobileMenu();
    initWishlist();
    initPropertySearch();
    initLaunchModal();
    initScrollEffects();
    initActiveNavigation();
});

/* =========================
   1. COMMON PRELOADER
   ========================= */

function initPreloader() {
    const preloader = document.getElementById("preloader");

    if (!preloader) return;

    const ring = document.getElementById("loaderRingProgress");
    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");

    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    if (ring) {
        ring.style.strokeDasharray = String(circumference);
        ring.style.strokeDashoffset = String(circumference);
    }

    // Restore the preloader when this page is revisited.
    preloader.classList.remove("is-hidden");

    let progress = 0;
    let animationFrame = null;
    let startTime = null;

    function renderProgress(value) {
        const percent = Math.min(100, Math.max(0, value));

        if (ring) {
            ring.style.strokeDashoffset =
                String(circumference * (1 - percent / 100));
        }

        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }

        if (progressPercent) {
            progressPercent.textContent = `${Math.round(percent)}%`;
        }
    }

    function animateProgress(timestamp) {
        if (startTime === null) startTime = timestamp;

        // The ring completes smoothly over approximately 900 ms.
        const elapsed = timestamp - startTime;
        const duration = 900;
        const eased = Math.min(1, elapsed / duration);

        progress = Math.round(100 * (1 - Math.pow(1 - eased, 3)));
        renderProgress(progress);

        if (eased < 1) {
            animationFrame = requestAnimationFrame(animateProgress);
        }
    }

    animationFrame = requestAnimationFrame(animateProgress);

    let pageReady = document.readyState === "complete";

    function hideWhenReady() {
        if (!pageReady) return;

        // Finish the progress ring before hiding the overlay.
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        renderProgress(100);

        window.setTimeout(() => {
            preloader.classList.add("is-hidden");
        }, 180);
    }

    if (!pageReady) {
        window.addEventListener("load", () => {
            pageReady = true;
            hideWhenReady();
        }, { once: true });
    } else {
        hideWhenReady();
    }
}

/* =========================
   2. PAGE NAVIGATION
   ========================= */

/* =========================
   3. MOBILE NAVIGATION
   ========================= */

function initMobileMenu() {
    const header = document.querySelector("header");
    const nav = document.querySelector(".nav-links");

    if (!header || !nav) return;

    const menuButton = document.createElement("button");

    menuButton.type = "button";
    menuButton.className = "mobile-menu-toggle";
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';

    const headerActions = header.querySelector(".header-actions");

    if (headerActions) {
        header.insertBefore(menuButton, headerActions.nextSibling);
    } else {
        header.appendChild(menuButton);
    }

    function closeMenu() {
        nav.classList.remove("mobile-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
        menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

    menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("mobile-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuButton.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (!header.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
            closeMenu();
        }
    });
}

/* =========================
   4. FAVOURITE HEART
   Default: gray heart, count 0
   Click: red heart, count 1
   Click again: gray heart, count 0
   ========================= */

function initWishlist() {
    if (
        document.body.classList.contains("services-page") ||
        document.querySelector(".details-container")
    ) {
        return;
    }

    const wishlistButton = document.getElementById("wishlistBtn");
    const wishlistCount = document.getElementById("wishlistCount");
    const wishlistIcon = wishlistButton?.querySelector(".wishlist-icon");

    if (!wishlistButton || !wishlistCount || !wishlistIcon) return;

    // This homepage has one clickable favourite heart.
    let isFavorite = false;

    function updateWishlist() {
        wishlistButton.classList.toggle("is-favorite", isFavorite);
        wishlistButton.setAttribute("role", "button");
        wishlistButton.setAttribute("tabindex", "0");
        wishlistButton.setAttribute(
            "aria-label",
            isFavorite ? "Remove from favourites" : "Add to favourites"
        );
        wishlistButton.setAttribute(
            "aria-pressed",
            String(isFavorite)
        );

        wishlistCount.textContent = isFavorite ? "1" : "0";
        wishlistIcon.style.color = isFavorite ? "#e53945" : "#858b86";
    }

    function toggleWishlist() {
        isFavorite = !isFavorite;
        updateWishlist();
    }

    wishlistButton.addEventListener("click", toggleWishlist);

    wishlistButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleWishlist();
        }
    });

    updateWishlist();
}

/* =========================
   5. PROPERTY SEARCH FILTERS
   ========================= */

function initPropertySearch() {
    const searchButton = document.getElementById("searchBtn");
    const locationFilter = document.getElementById("filterLocation");
    const typeFilter = document.getElementById("filterType");
    const priceFilter = document.getElementById("filterPrice");
    const bedsFilter = document.getElementById("filterBeds");
    const propertyGrid = document.getElementById("propertyGrid");

    if (
        !searchButton ||
        !locationFilter ||
        !typeFilter ||
        !priceFilter ||
        !bedsFilter ||
        !propertyGrid
    ) {
        return;
    }

    const originalCards = Array.from(
        propertyGrid.querySelectorAll(".property-card")
    );

    function applyFilters() {
        const location = locationFilter.value.toLowerCase();
        const type = typeFilter.value.toLowerCase();
        const price = priceFilter.value.toLowerCase();
        const beds = bedsFilter.value;

        let visibleCount = 0;

        originalCards.forEach((card) => {
            const matchesLocation =
                !location || card.dataset.location === location;

            const matchesType =
                !type || card.dataset.type === type;

            const matchesPrice =
                !price || card.dataset.price === price;

            const cardBeds = Number(card.dataset.beds || 0);

            const matchesBeds = !beds ||
                (beds === "5"
                    ? cardBeds >= 5
                    : cardBeds === Number(beds));

            const matches =
                matchesLocation &&
                matchesType &&
                matchesPrice &&
                matchesBeds;

            card.classList.toggle("is-filtered-out", !matches);

            if (matches) visibleCount++;
        });

        let emptyMessage = propertyGrid.querySelector(".no-properties");

        if (visibleCount === 0) {
            if (!emptyMessage) {
                emptyMessage = document.createElement("div");
                emptyMessage.className = "no-properties";
                emptyMessage.innerHTML = `
                    <i class="fa-solid fa-house-circle-exclamation"></i>
                    <strong>No matching properties found.</strong>
                    <p>Try changing your location, property type, budget or BHK.</p>
                `;
                propertyGrid.appendChild(emptyMessage);
            }
        } else if (emptyMessage) {
            emptyMessage.remove();
        }

        const propertiesSection = document.getElementById("properties");

        if (propertiesSection) {
            propertiesSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    searchButton.addEventListener("click", applyFilters);

    [locationFilter, typeFilter, priceFilter, bedsFilter].forEach((select) => {
        select.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                applyFilters();
            }
        });
    });
}

/* =========================
   6. ADD NEW LAUNCH MODAL
   ========================= */

function initLaunchModal() {
    const modal = document.getElementById("addLaunchModal");
    const openButton = document.getElementById("openModalBtn");
    const closeButton = document.getElementById("closeModalBtn");
    const form = document.getElementById("newLaunchForm");
    const propertyGrid = document.getElementById("propertyGrid");

    if (!modal || !openButton || !closeButton || !form || !propertyGrid) {
        return;
    }

    const imageInput = document.getElementById("newPropImage");
    const titleInput = document.getElementById("newPropTitle");
    const locationInput = document.getElementById("newPropLocation");
    const typeInput = document.getElementById("newPropType");
    const priceInput = document.getElementById("newPropPrice");
    const bedsInput = document.getElementById("newPropBeds");
    const bathsInput = document.getElementById("newPropBaths");
    const sqftInput = document.getElementById("newPropSqft");

    function openModal() {
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");

        window.setTimeout(() => {
            titleInput?.focus();
        }, 150);
    }

    function closeModal() {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
    }

    openButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const file = imageInput.files?.[0];

        if (!file) {
            alert("Please select a property image.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        // Prevent very large image files from being loaded into the page.
        if (file.size > 5 * 1024 * 1024) {
            alert("Please select an image smaller than 5 MB.");
            return;
        }

        const title = titleInput.value.trim();
        const location = locationInput.value;
        const type = typeInput.value;
        const price = priceInput.value.trim();
        const beds = Number(bedsInput.value);
        const baths = Number(bathsInput.value);
        const sqft = Number(sqftInput.value);

        if (!title || !price || beds < 1 || baths < 1 || sqft < 1) {
            alert("Please enter valid property details.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const card = document.createElement("article");
            card.className = "property-card js-reveal is-visible";
            card.dataset.location = location;
            card.dataset.type = type;
            card.dataset.price = inferPriceCategory(price);
            card.dataset.beds = String(beds);

            const media = document.createElement("div");
            media.className = "card-media";

            const image = document.createElement("img");
            image.src = String(reader.result);
            image.alt = title;
            image.loading = "lazy";

            const tag = document.createElement("span");
            tag.className = "property-tag sale";
            tag.textContent = "New Launch";

            media.append(image, tag);

            const body = document.createElement("div");
            body.className = "card-body";

            const locationText = document.createElement("p");
            locationText.className = "card-location";

            const locationIcon = document.createElement("i");
            locationIcon.className = "fa-solid fa-location-dot";

            locationText.append(locationIcon, document.createTextNode(
                ` ${formatLocation(location)}`
            ));

            const heading = document.createElement("h3");
            heading.textContent = title;

            const features = document.createElement("div");
            features.className = "card-features";

            features.append(
                makeFeature("fa-solid fa-bed", `${beds} Beds`),
                makeFeature("fa-solid fa-bath", `${baths} Baths`),
                makeFeature("fa-solid fa-vector-square", `${sqft.toLocaleString()} sqft`)
            );

            const footer = document.createElement("div");
            footer.className = "card-foot";

            const priceText = document.createElement("span");
            priceText.className = "card-price";
            priceText.textContent = price;

            const detailsLink = document.createElement("a");
            detailsLink.className = "btn-card-action";
            detailsLink.href = makeDetailsUrl({
                title,
                price,
                location: formatLocation(location),
                type,
                beds,
                baths,
                sqft,
                image: String(reader.result)
            });
            detailsLink.setAttribute("aria-label", `View ${title} details`);
            detailsLink.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';

            footer.append(priceText, detailsLink);
            body.append(locationText, heading, features, footer);
            card.append(media, body);

            // Add the new card to the front of the list.
            propertyGrid.prepend(card);

            // Add it to the filterable cards collection.
            const allCards = Array.from(
                propertyGrid.querySelectorAll(".property-card")
            );

            // Keep the newly added card visible until a new search is performed.
            allCards.forEach((item) => {
                item.classList.remove("is-filtered-out");
            });

            form.reset();
            closeModal();

            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            alert("New launch added to this page successfully.");
        };

        reader.onerror = () => {
            alert("The image could not be read. Please try another image.");
        };

        reader.readAsDataURL(file);
    });

    function makeFeature(iconClass, label) {
        const span = document.createElement("span");
        const icon = document.createElement("i");

        icon.className = iconClass;
        span.append(icon, document.createTextNode(` ${label}`));

        return span;
    }

    function formatLocation(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function inferPriceCategory(value) {
        const normalized = value
            .replace(/,/g, "")
            .replace(/[₹\s]/g, "")
            .toLowerCase();

        const number = parseFloat(normalized);

        if (normalized.includes("cr")) {
            if (number >= 2) return "luxury";
            if (number >= 1) return "1crto2cr";
            return "50to1cr";
        }

        if (normalized.includes("lakh") || normalized.includes("lac")) {
            if (number < 25) return "under25";
            if (number < 50) return "under50";
            if (number <= 100) return "50to1cr";
            if (number <= 200) return "1crto2cr";
            return "luxury";
        }

        return "";
    }

    function makeDetailsUrl(property) {
        const params = new URLSearchParams({
            title: property.title,
            price: property.price,
            type: property.type,
            location: property.location,
            beds: String(property.beds),
            baths: String(property.baths),
            sqft: String(property.sqft)
        });

        // The uploaded image is only available in this page session.
        // Do not place its large data URL into the address bar.
        return `property-details.html?${params.toString()}`;
    }
}

/* =========================
   7. SCROLL / HEADER EFFECTS
   ========================= */

function initScrollEffects() {
    const header = document.querySelector("header");

    function updateHeader() {
        if (!header) return;

        header.classList.toggle("header-scrolled", window.scrollY > 20);
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, { passive: true });

    const revealElements = document.querySelectorAll(
        ".stat-card, .section-title-row, .property-card, " +
        ".promo-banner, .help-box-clean, .cat-card"
    );

    revealElements.forEach((element) => {
        element.classList.add("js-reveal");
    });

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}

/* =========================
   8. ACTIVE NAVIGATION LINK
   ========================= */

function initActiveNavigation() {
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() || "home.html";

    document.querySelectorAll(".nav-links a").forEach((link) => {
        let linkPage;

        try {
            linkPage = new URL(link.href, window.location.href)
                .pathname.split("/").pop().toLowerCase();
        } catch {
            return;
        }

        const isCurrent = linkPage === currentPage;

        link.classList.toggle("active", isCurrent);

        if (isCurrent) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}
/* =========================================================
   STACKLY REAL ESTATE - PROPERTY DETAILS JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initDetailsPreloader();
    initDetailsWishlist();
    initPropertyGallery();
    initPropertyQuery();
    initPropertyTabs();
    initAmenities();
    initBookingModal();
    initScheduleModal();
    initGalleryModal();
    initDetailsHeader();
    initAboutBookingResult();
});

/* =========================
   1. COMMON PRELOADER
   ========================= */

function initDetailsPreloader() {
    const overlay = document.getElementById("preloader");
    if (!overlay) return;

    const ring = document.getElementById("loaderRingProgress");
    const fill = document.getElementById("progressFill");
    const percent = document.getElementById("progressPercent");
    const circumference = 2 * Math.PI * 70;

    if (ring) {
        ring.style.strokeDasharray = String(circumference);
        ring.style.strokeDashoffset = String(circumference);
    }

    let started = null;
    let rafId = null;

    function paint(value) {
        const amount = Math.min(100, Math.max(0, value));

        if (ring) {
            ring.style.strokeDashoffset =
                String(circumference * (1 - amount / 100));
        }

        if (fill) fill.style.width = `${amount}%`;
        if (percent) percent.textContent = `${Math.round(amount)}%`;
    }

    function animate(time) {
        if (started === null) started = time;

        const ratio = Math.min(1, (time - started) / 850);
        paint(100 * (1 - Math.pow(1 - ratio, 3)));

        if (ratio < 1) {
            rafId = requestAnimationFrame(animate);
        }
    }

    rafId = requestAnimationFrame(animate);

    function finish() {
        if (rafId) cancelAnimationFrame(rafId);
        paint(100);

        window.setTimeout(() => {
            overlay.classList.add("is-hidden");
        }, 160);
    }

    if (document.readyState === "complete") {
        finish();
    } else {
        window.addEventListener("load", finish, { once: true });
    }
}

/* =========================
   2. FAVOURITE HEART
   ========================= */

function initDetailsWishlist() {
    const button = document.getElementById("wishlistBtn");
    const count = document.getElementById("wishlistCount");
    const icon = button?.querySelector(".wishlist-icon");

    if (!button || !count || !icon) return;

    let favourite = false;

    function render() {
        button.classList.toggle("is-favorite", favourite);
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        button.setAttribute("aria-pressed", String(favourite));
        button.setAttribute(
            "aria-label",
            favourite ? "Remove favourite" : "Add favourite"
        );

        icon.style.color = favourite ? "#e53945" : "#858b86";
        count.textContent = favourite ? "1" : "0";
    }

    function toggle() {
        favourite = !favourite;
        render();
    }

    button.addEventListener("click", toggle);

    button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
        }
    });

    render();
}

/* =========================
   4. PROPERTY DEMO DATA
   Use your actual property records here.
   ========================= */

const propertyRecords = [
    {
        id: 0,
        title: "Luxury 3 BHK Villa",
        image: "img/clay-banks-364plyVT2eQ-unsplash.webp",
        price: "25,000",
        duration: "/month",
        type: "For Rent",
        location: "Whitefield, Bangalore",
        beds: "3",
        baths: "3",
        sqft: "2,400",
        description: "A thoughtfully designed villa with spacious rooms, landscaped surroundings, secure access and comfortable modern living.",
        amenities: ["Furnished", "Swimming Pool", "Power Backup", "Gated Community", "24/7 Security", "Car Parking"],
        mapQuery: "Whitefield, Bangalore",
        reviews: [
            { name: "Arun K.", stars: 5, date: "Recent review", text: "Well-planned interiors and a peaceful neighbourhood. The property visit was useful." },
            { name: "Meera S.", stars: 4, date: "Recent review", text: "Good layout and convenient access to shops and everyday facilities." }
        ]
    },
    {
        id: 1,
        title: "Royal Elite Villa",
        image: "img/francesca-tosolini-Gu4R-0lwXvk-unsplash.webp",
        price: "2.80 Cr",
        duration: "",
        type: "For Sale",
        location: "Indiranagar, Bangalore",
        beds: "4",
        baths: "4",
        sqft: "3,800",
        description: "An elegant luxury villa featuring generous living areas, contemporary architecture and premium residential surroundings.",
        amenities: ["Furnished", "Swimming Pool", "Power Backup", "Gated Community", "24/7 Security", "Car Parking"],
        mapQuery: "Indiranagar, Bangalore",
        reviews: [
            { name: "Karthik R.", stars: 5, date: "Recent review", text: "Spacious rooms and an attractive design. The location is convenient." },
            { name: "Priya M.", stars: 5, date: "Recent review", text: "A premium property with plenty of natural light and a well-planned layout." }
        ]
    },
    {
        id: 2,
        title: "Oceanic Horizon Apartment",
        image: "img/point3d-commercial-imaging-ltd-hfXcKWPGxQs-unsplash.webp",
        price: "50,000",
        duration: "/month",
        type: "For Rent",
        location: "ECR Seaface, Chennai",
        beds: "3",
        baths: "3",
        sqft: "2,100",
        description: "A contemporary apartment near the Chennai coast, with comfortable bedrooms and a bright open-plan living space.",
        amenities: ["Furnished", "Swimming Pool", "Power Backup", "24/7 Security", "Car Parking"],
        mapQuery: "ECR, Chennai, Tamil Nadu",
        reviews: [
            { name: "Divya P.", stars: 5, date: "Recent review", text: "The apartment has a lovely layout and is convenient for coastal living." },
            { name: "Sanjay V.", stars: 4, date: "Recent review", text: "Comfortable rooms and useful facilities. Check traffic during your visit." }
        ]
    },
    {
        id: 3,
        title: "Whispering Pines Villa",
        image: "img/d5-render-O3LR3ZI5Ams-unsplash.webp",
        price: "1.85 Cr",
        duration: "",
        type: "For Sale",
        location: "Race Course, Coimbatore",
        beds: "3",
        baths: "3",
        sqft: "3,100",
        description: "A refined family villa offering a calm residential setting, spacious interiors and room for everyday family activities.",
        amenities: ["Furnished", "Power Backup", "Gated Community", "24/7 Security", "Car Parking"],
        mapQuery: "Race Course, Coimbatore, Tamil Nadu",
        reviews: [
            { name: "Ramesh S.", stars: 5, date: "Recent review", text: "A comfortable family home with a practical layout and a peaceful setting." },
            { name: "Anitha R.", stars: 4, date: "Recent review", text: "The rooms feel spacious and the location is useful for daily travel." }
        ]
    },
    {
        id: 4,
        title: "Green Park Studio",
        image: "img/point3d-commercial-imaging-ltd-wc4QVZmAF58-unsplash.webp",
        price: "22,000",
        duration: "/month",
        type: "For Rent",
        location: "Gachibowli, Hyderabad",
        beds: "1",
        baths: "1",
        sqft: "850",
        description: "A compact, practical studio designed for individuals seeking convenient access to offices, shops and city facilities.",
        amenities: ["Furnished", "Power Backup", "24/7 Security", "Car Parking"],
        mapQuery: "Gachibowli, Hyderabad, Telangana",
        reviews: [
            { name: "Naveen P.", stars: 4, date: "Recent review", text: "A practical option for one person, with a compact and easy-to-maintain layout." },
            { name: "Sowmya K.", stars: 5, date: "Recent review", text: "Convenient location for work and everyday errands." }
        ]
    },
    {
        id: 5,
        title: "Skyline Luxury Penthouse",
        image: "img/steven-ungermann-g4zOyqK_QsY-unsplash.webp",
        price: "4.50 Cr",
        duration: "",
        type: "For Sale",
        location: "Nungambakkam, Chennai",
        beds: "5",
        baths: "6",
        sqft: "5,200",
        description: "A spacious luxury penthouse with expansive living areas, a premium finish and an elevated city-home experience.",
        amenities: ["Furnished", "Swimming Pool", "Power Backup", "24/7 Security", "Car Parking"],
        mapQuery: "Nungambakkam, Chennai, Tamil Nadu",
        reviews: [
            { name: "Lakshmi D.", stars: 5, date: "Recent review", text: "Impressive space and an elegant design suited to larger families." },
            { name: "Vikram N.", stars: 5, date: "Recent review", text: "The floor plan and generous room sizes make this an appealing premium home." }
        ]
    },
    {
        id: 6,
        title: "Bandra Sea-View Flat",
        image: "img/steven-ungermann-CVTmLMv5oG4-unsplash.webp",
        price: "3.10 Cr",
        duration: "",
        type: "For Sale",
        location: "Bandra West, Mumbai",
        beds: "2",
        baths: "2",
        sqft: "1,400",
        description: "A modern city apartment with a comfortable interior layout and the appeal of a coastal neighbourhood.",
        amenities: ["Furnished", "Power Backup", "24/7 Security", "Car Parking"],
        mapQuery: "Bandra West, Mumbai, Maharashtra",
        reviews: [
            { name: "Rohan M.", stars: 5, date: "Recent review", text: "An attractive city home with a practical use of space." },
            { name: "Neha T.", stars: 4, date: "Recent review", text: "The neighbourhood has useful amenities and good city connections." }
        ]
    },
    {
        id: 7,
        title: "Smart Eco-Villa",
        image: "img/stephan-bechert-yFV39g6AZ5o-unsplash.webp",
        price: "1.95 Cr",
        duration: "",
        type: "For Sale",
        location: "ECR, Chennai",
        beds: "4",
        baths: "4",
        sqft: "3,400",
        description: "A contemporary eco-villa concept with solar-ready features, modern living spaces and a focus on resource-conscious living.",
        amenities: ["Furnished", "Power Backup", "Gated Community", "24/7 Security", "Car Parking"],
        mapQuery: "East Coast Road, Chennai, Tamil Nadu",
        reviews: [
            { name: "Hari S.", stars: 5, date: "Recent review", text: "An interesting home concept with a spacious family layout." },
            { name: "Keerthi A.", stars: 4, date: "Recent review", text: "The design looks promising. Confirm included eco-features during the visit." }
        ]
    },
    {
        id: 8,
        title: "Modern Garden Apartment",
        image: "img/point3d-commercial-imaging-ltd-zuJLTgQ53_Q-unsplash.webp",
        price: "78,000",
        duration: "/month",
        type: "For Rent",
        location: "Adyar, Chennai",
        beds: "2",
        baths: "2",
        sqft: "1,600",
        description: "A modern apartment concept with a relaxed interior design and access to established residential amenities.",
        amenities: ["Furnished", "Power Backup", "24/7 Security", "Car Parking"],
        mapQuery: "Adyar, Chennai, Tamil Nadu",
        reviews: [
            { name: "Mohan B.", stars: 4, date: "Recent review", text: "A pleasant layout with useful everyday facilities." },
            { name: "Asha P.", stars: 5, date: "Recent review", text: "Comfortable interiors and a convenient residential setting." }
        ]
    },
    {
        id: 9,
        title: "Premium City Residence",
        image: "img/point3d-commercial-imaging-ltd-xON7AIJZemw-unsplash.webp",
        price: "1.25 Cr",
        duration: "",
        type: "For Sale",
        location: "Anna Nagar, Chennai",
        beds: "3",
        baths: "3",
        sqft: "2,200",
        description: "A well-proportioned city residence designed for comfortable everyday living and convenient access to local services.",
        amenities: ["Furnished", "Power Backup", "24/7 Security", "Car Parking"],
        mapQuery: "Anna Nagar, Chennai, Tamil Nadu",
        reviews: [
            { name: "Bala K.", stars: 5, date: "Recent review", text: "Good room proportions and a practical layout for a family." },
            { name: "Janani R.", stars: 4, date: "Recent review", text: "The area has useful facilities for everyday life." }
        ]
    },
    {
        id: 10,
        title: "Contemporary Family Home",
        image: "img/steven-ungermann-CVTmLMv5oG4-unsplash.webp",
        price: "92,000",
        duration: "/month",
        type: "For Rent",
        location: "Sarjapur Road, Bangalore",
        beds: "3",
        baths: "3",
        sqft: "2,300",
        description: "A family-friendly home concept with practical living areas and convenient connections to the surrounding neighbourhood.",
        amenities: ["Furnished", "Swimming Pool", "Power Backup", "Gated Community", "24/7 Security", "Car Parking"],
        mapQuery: "Sarjapur Road, Bangalore, Karnataka",
        reviews: [
            { name: "Suresh D.", stars: 4, date: "Recent review", text: "A useful family layout with a good selection of facilities." },
            { name: "Pavithra M.", stars: 5, date: "Recent review", text: "Comfortable rooms and a convenient location for daily travel." }
        ]
    },
    {
        id: 11,
        title: "Coimbatore Garden Villa",
        image: "img/francesca-tosolini-Gu4R-0lwXvk-unsplash.webp",
        price: "1.45 Cr",
        duration: "",
        type: "For Sale",
        location: "Peelamedu, Coimbatore",
        beds: "4",
        baths: "3",
        sqft: "2,850",
        description: "A spacious villa concept with a family-focused layout, landscaped surroundings and flexible living areas.",
        amenities: ["Furnished", "Power Backup", "Gated Community", "24/7 Security", "Car Parking"],
        mapQuery: "Peelamedu, Coimbatore, Tamil Nadu",
        reviews: [
            { name: "Prakash V.", stars: 5, date: "Recent review", text: "A spacious layout that could work well for a growing family." },
            { name: "Malathi S.", stars: 4, date: "Recent review", text: "A pleasant home concept with practical room arrangements." }
        ]
    }
];

let activeProperty = propertyRecords[0];
let pendingGalleryProperty = propertyRecords[0];

/* =========================
   5. LOAD PROPERTY FROM URL
   ========================= */

function initPropertyQuery() {
    if (!document.querySelector(".details-container")) return;

    const params = new URLSearchParams(location.search);

    const title = params.get("title");
    if (!title) {
        applyProperty(activeProperty);
        return;
    }

    const matched = propertyRecords.find(
        (property) => property.title.toLowerCase() === title.toLowerCase()
    );

    if (matched) {
        activeProperty = { ...matched };
    } else {
        // Keep incoming homepage property data, even if it is not in demo records.
        activeProperty = {
            ...propertyRecords[0],
            title: title,
            price: params.get("price") || propertyRecords[0].price,
            duration: "",
            type: params.get("type") || propertyRecords[0].type,
            location: params.get("location") || propertyRecords[0].location,
            beds: params.get("beds") || propertyRecords[0].beds,
            baths: params.get("baths") || propertyRecords[0].baths,
            sqft: params.get("sqft") || propertyRecords[0].sqft,
            image: params.get("img") || propertyRecords[0].image,
            mapQuery: params.get("location") || propertyRecords[0].mapQuery
        };
    }

    applyProperty(activeProperty);
}

/* =========================
   6. UPDATE ALL PROPERTY UI
   ========================= */

function applyProperty(property) {
    activeProperty = { ...property };

    setText("propTitleDisplay", property.title);
    setText("propLocationText", property.location);
    setText("propBedsDisplay", property.beds);
    setText("propBathsDisplay", property.baths);
    setText("propSqftDisplay", property.sqft);
    setText("propPriceDisplay", property.price);
    setText("propDurationDisplay", property.duration || "");
    setText("propDescDisplay", property.description || "Contact our property team for further details.");
    setText("locationAddressDisplay", property.mapQuery || property.location);

    const locationNode = document.getElementById("propLocationText");

    if (locationNode) {
        locationNode.replaceChildren();

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-location-dot";

        locationNode.append(icon, document.createTextNode(" " + property.location));
    }

    const mainImage = document.getElementById("mainPropertyImg");

    if (mainImage) {
        mainImage.src = property.image;
        mainImage.alt = property.title;
    }

    const type = property.type || "For Sale";

    setText("propTagDisplay", type);
    setText("propBadgeDisplay", type);

    const badge = document.getElementById("propBadgeDisplay");

    if (badge) {
        badge.classList.toggle("badge-sale", /sale/i.test(type));
        badge.classList.toggle("badge-rent", /rent/i.test(type));
    }

    const tag = document.getElementById("propTagDisplay");

    if (tag) {
        tag.classList.toggle("sale", /sale/i.test(type));
        tag.classList.toggle("rent", /rent/i.test(type));
    }

    const map = document.getElementById("propertyMapIframe");

    if (map) {
        const query = property.mapQuery || property.location;
        map.src =
            "https://maps.google.com/maps?q=" +
            encodeURIComponent(query) +
            "&output=embed";
        map.title = "Map showing " + query;
    }

    updateSelectedAmenities(property);
    renderPropertyReviews(property);
    renderFullAmenities(property);
    updateBookingPropertyTitle();

    document.title = `${property.title} | Stackly Real Estate`;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value ?? "";
}

/* =========================
   7. PROPERTY GALLERY
   ========================= */

function initPropertyGallery() {
    const thumbnails = document.querySelectorAll(
        ".thumbnail-row > img"
    );

    thumbnails.forEach((image, index) => {
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", `Select property photo ${index + 1}`);

        image.addEventListener("click", () => {
            const imageUrl = image.getAttribute("src");
            const record = propertyRecords.find(
                (property) => property.image === imageUrl
            );

            if (record) {
                applyProperty(record);
            } else {
                const next = { ...activeProperty, image: imageUrl };
                applyProperty(next);
            }

            setActiveThumbnail(image);
        });

        image.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                image.click();
            }
        });
    });
}

function changeImage(element, index) {
    const url = element?.getAttribute("src");
    if (!url) return;

    const record = propertyRecords.find((property) => property.image === url);

    if (record) {
        applyProperty(record);
    } else {
        applyProperty({ ...activeProperty, image: url });
    }

    setActiveThumbnail(element);
}

function setActiveThumbnail(activeImage) {
    document.querySelectorAll(".thumbnail-row > img").forEach((image) => {
        image.classList.toggle("active-thumbnail", image === activeImage);
    });
}

/* =========================
   8. GALLERY MODAL: 12 OPTIONS
   Click an option, then Done to apply
   ========================= */

function initGalleryModal() {
    const modal = document.getElementById("galleryModal");
    const openButton = document.getElementById("openGalleryModal");
    const closeButton = document.getElementById("closeGalleryModal");
    const doneButton = document.getElementById("doneGalleryBtn");
    const grid = document.getElementById("lightboxGridContainer");

    if (!modal || !openButton || !closeButton || !doneButton || !grid) {
        return;
    }

    function openGallery() {
        pendingGalleryProperty = { ...activeProperty };
        renderGalleryOptions();
        openModal(modal);
    }

    function renderGalleryOptions() {
        grid.replaceChildren();

        propertyRecords.forEach((property) => {
            const option = document.createElement("button");
            option.type = "button";
            option.className = "gallery-option";
            option.classList.toggle(
                "selected",
                pendingGalleryProperty.id === property.id
            );

            const image = document.createElement("img");
            image.src = property.image;
            image.alt = property.title;
            image.loading = "lazy";

            const title = document.createElement("span");
            title.append(document.createTextNode(property.title));

            const price = document.createElement("small");
            price.className = "gallery-price";
            price.textContent =
                `${property.type} · ₹${property.price}${property.duration ? " " + property.duration : ""}`;

            title.appendChild(price);
            option.append(image, title);

            option.addEventListener("click", () => {
                pendingGalleryProperty = { ...property };

                grid.querySelectorAll(".gallery-option").forEach((node) => {
                    node.classList.remove("selected");
                });

                option.classList.add("selected");
            });

            grid.appendChild(option);
        });
    }

    openButton.addEventListener("click", openGallery);
    closeButton.addEventListener("click", () => closeModal(modal));

    doneButton.addEventListener("click", () => {
        applyProperty(pendingGalleryProperty);
        closeModal(modal);
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("show")) {
            closeModal(modal);
        }
    });
}

/* =========================
   9. PROPERTY TABS
   ========================= */

function initPropertyTabs() {
    const buttons = document.querySelectorAll(".tab-btn");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const match = button.getAttribute("onclick")?.match(
                /switchTab\(['"]([^'"]+)/
            );

            const tabName = match?.[1];

            if (tabName) {
                switchTab(tabName, button);
            }
        });
    });
}

function switchTab(name, button) {
    document.querySelectorAll(".tab-btn").forEach((tab) => {
        tab.classList.toggle("active", tab === button);
    });

    document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.toggle("active", content.id === `tab-${name}`);
    });

    if (name === "location") {
        const map = document.getElementById("propertyMapIframe");
        if (map) map.src = map.src;
    }
}

/* =========================
   10. AMENITIES
   ========================= */

function initAmenities() {
    const group = document.getElementById("amenitiesCheckboxGroup");
    if (!group) return;

    group.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            renderFullAmenities(activeProperty);
        });
    });
}

function updateSelectedAmenities(property) {
    const group = document.getElementById("amenitiesCheckboxGroup");
    if (!group) return;

    group.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = (property.amenities || []).includes(checkbox.value);
    });
}

function renderFullAmenities(property) {
    const list = document.getElementById("dynamicAmenitiesList");
    if (!list) return;

    const checked = document.querySelectorAll(
        '#amenitiesCheckboxGroup input[type="checkbox"]:checked'
    );

    const selected = Array.from(checked).map((checkbox) => checkbox.value);

    list.replaceChildren();

    const icons = {
        "Furnished": "fa-couch",
        "Swimming Pool": "fa-person-swimming",
        "Power Backup": "fa-bolt",
        "Gated Community": "fa-shield-halved",
        "24/7 Security": "fa-video",
        "Car Parking": "fa-car",
        "High-Speed Wi-Fi": "fa-wifi",
        "Fitness Center": "fa-dumbbell"
    };

    const names = selected.length ? selected : [];

    if (!names.length) {
        const empty = document.createElement("p");
        empty.textContent = "No amenities selected. Select amenities above to view them here.";
        list.appendChild(empty);
        return;
    }

    names.forEach((name) => {
        const item = document.createElement("span");
        const icon = document.createElement("i");

        icon.className = `fa-solid ${icons[name] || "fa-check-circle"}`;
        item.append(icon, document.createTextNode(" " + name));
        list.appendChild(item);
    });
}

/* =========================
   11. REVIEWS
   ========================= */

function renderPropertyReviews(property) {
    const list = document.getElementById("dynamicReviewsList");
    if (!list) return;

    list.replaceChildren();

    const reviews = property.reviews || [];
    const summary = document.createElement("div");
    summary.className = "review-summary";

    const average = reviews.length
        ? reviews.reduce((total, review) => total + review.stars, 0) / reviews.length
        : 0;

    const score = document.createElement("strong");
    score.className = "review-score";
    score.textContent = average ? average.toFixed(1) : "—";

    const summaryText = document.createElement("p");
    summaryText.textContent = reviews.length
        ? `${reviews.length} sample reviews for ${property.title}`
        : "No reviews available for this property yet.";

    summary.append(score, summaryText);
    list.appendChild(summary);

    reviews.forEach((review) => {
        const card = document.createElement("article");
        card.className = "review-card";

        const top = document.createElement("div");
        top.className = "review-top";

        const name = document.createElement("span");
        name.className = "review-name";
        name.textContent = review.name;

        const stars = document.createElement("span");
        stars.className = "review-stars";
        stars.setAttribute("aria-label", `${review.stars} out of 5 stars`);
        stars.textContent = "★".repeat(review.stars) + "☆".repeat(5 - review.stars);

        top.append(name, stars);

        const date = document.createElement("span");
        date.className = "review-date";
        date.textContent = review.date;

        const body = document.createElement("p");
        body.textContent = review.text;

        card.append(top, date, body);
        list.appendChild(card);
    });
}

/* =========================
   12. BOOKING MODAL
   Redirect to about.html with booking details
   ========================= */

function initBookingModal() {
    const modal = document.getElementById("bookModal");
    const openButton = document.getElementById("openBookModal");
    const closeButton = document.getElementById("closeBookModal");
    const form = document.getElementById("bookingForm");

    if (!modal || !openButton || !closeButton || !form) return;

    const checkIn = document.getElementById("bookCheckIn");
    const checkOut = document.getElementById("bookCheckOut");

    const today = new Date();
    const localToday = formatDateInput(today);

    if (checkIn) checkIn.min = localToday;
    if (checkOut) checkOut.min = localToday;

    checkIn?.addEventListener("change", () => {
        if (checkOut) {
            checkOut.min = checkIn.value || localToday;

            if (checkOut.value && checkIn.value && checkOut.value < checkIn.value) {
                checkOut.value = "";
            }
        }
    });

    openButton.addEventListener("click", () => {
        updateBookingPropertyTitle();
        openModal(modal);
    });

    closeButton.addEventListener("click", () => closeModal(modal));

    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        if (checkIn.value && checkOut.value && checkOut.value < checkIn.value) {
            alert("Check-out date must be on or after check-in date.");
            return;
        }

        const contact = document.getElementById("bookContact").value.trim();
        const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
        const looksLikePhone = /^\+?[\d\s()-]{8,18}$/.test(contact);

        if (!looksLikeEmail && !looksLikePhone) {
            alert("Enter a valid email address or mobile number.");
            return;
        }

        const booking = {
            name: document.getElementById("bookName").value.trim(),
            contact,
            work: document.getElementById("bookWork").value.trim(),
            salary: document.getElementById("bookSalary").value,
            checkIn: checkIn.value,
            checkOut: checkOut.value,
            property: activeProperty.title,
            price: activeProperty.price,
            duration: activeProperty.duration,
            type: activeProperty.type,
            location: activeProperty.location,
            beds: activeProperty.beds,
            baths: activeProperty.baths,
            sqft: activeProperty.sqft,
            image: activeProperty.image,
            mapQuery: activeProperty.mapQuery || activeProperty.location,
            amenities: Array.from(document.querySelectorAll(
                '#amenitiesCheckboxGroup input[type="checkbox"]:checked'
            )).map((checkbox) => checkbox.value)
        };

        // Keep only non-sensitive property selection details in session storage.
        // Personal details remain in the URL only for this demo redirect.
        try {
            sessionStorage.setItem("stacklySelectedProperty", JSON.stringify({
                property: booking.property,
                price: booking.price,
                duration: booking.duration,
                type: booking.type,
                location: booking.location,
                beds: booking.beds,
                baths: booking.baths,
                sqft: booking.sqft,
                image: booking.image,
                mapQuery: booking.mapQuery,
                amenities: booking.amenities
            }));
        } catch {
            // The URL still carries the required demo booking details.
        }

        const params = new URLSearchParams(booking);
        closeModal(modal);

        // The about page must use the query parameters to show the booking.
        navigateWithPreloader(`about.html?${params.toString()}`);
    });
}

function updateBookingPropertyTitle() {
    const field = document.getElementById("bookPropertyTitle");
    if (field) field.value = activeProperty.title;
}

/* =========================
   13. SCHEDULE SITE VISIT
   ========================= */

function initScheduleModal() {
    const modal = document.getElementById("scheduleModal");
    const openButton = document.getElementById("openScheduleModal");
    const closeButton = document.getElementById("closeScheduleModal");
    const form = document.getElementById("scheduleForm");

    if (!modal || !openButton || !closeButton || !form) return;

    const dateInput = document.getElementById("schedDate");
    if (dateInput) dateInput.min = formatDateInput(new Date());

    openButton.addEventListener("click", () => openModal(modal));
    closeButton.addEventListener("click", () => closeModal(modal));

    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const phone = document.getElementById("schedPhone").value.trim();

        if (!/^\+?[\d\s()-]{8,18}$/.test(phone)) {
            alert("Please enter a valid phone number.");
            return;
        }

        const params = new URLSearchParams({
            bookingKind: "visit",
            name: document.getElementById("schedName").value.trim(),
            phone,
            visitDate: dateInput.value,
            slot: document.getElementById("schedSlot").value,
            property: activeProperty.title,
            price: activeProperty.price,
            location: activeProperty.location,
            type: activeProperty.type,
            image: activeProperty.image
        });

        closeModal(modal);
        navigateWithPreloader(`about.html?${params.toString()}`);
    });
}

/* =========================
   14. NAVIGATION WITH PRELOADER
   ========================= */

function navigateWithPreloader(destination) {
    const overlay = document.getElementById("preloader");

    if (!overlay) {
        location.href = destination;
        return;
    }

    overlay.classList.remove("is-hidden");

    const ring = document.getElementById("loaderRingProgress");
    const fill = document.getElementById("progressFill");
    const percent = document.getElementById("progressPercent");
    const circumference = 2 * Math.PI * 70;

    let progress = 0;

    if (ring) {
        ring.style.strokeDasharray = String(circumference);
        ring.style.strokeDashoffset = String(circumference);
    }

    if (fill) fill.style.width = "0%";
    if (percent) percent.textContent = "0%";

    const timer = window.setInterval(() => {
        progress = Math.min(progress + 10, 90);

        if (ring) {
            ring.style.strokeDashoffset =
                String(circumference * (1 - progress / 100));
        }

        if (fill) fill.style.width = `${progress}%`;
        if (percent) percent.textContent = `${progress}%`;

        if (progress >= 90) window.clearInterval(timer);
    }, 25);

    window.setTimeout(() => {
        window.clearInterval(timer);
        location.href = destination;
    }, 220);
}

/* =========================
   15. HEADER SCROLL EFFECT
   ========================= */

function initDetailsHeader() {
    const header = document.querySelector("header");
    const nav = document.querySelector(".nav-links");

    function onScroll() {
        if (header) {
            header.classList.toggle("header-scrolled", window.scrollY > 20);
        }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!header || !nav) return;

    const currentFile = location.pathname.split("/").pop().toLowerCase();

    nav.querySelectorAll("a").forEach((link) => {
        const targetFile = new URL(link.href, location.href)
            .pathname.split("/").pop().toLowerCase();

        const current = targetFile === currentFile;

        link.classList.toggle("active", current);

        if (current) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

/* =========================
   16. SHOW BOOKING ON ABOUT PAGE
   This runs when the same script is included in about.html.
   ========================= */

function initAboutBookingResult() {
    const filename = location.pathname.split("/").pop().toLowerCase();

    if (filename !== "about.html") return;

    const params = new URLSearchParams(location.search);
    const property = params.get("property");

    if (!property) return;

    const summary = document.createElement("section");
    summary.className = "booking-result-banner";

    const heading = document.createElement("h2");
    heading.textContent = params.get("bookingKind") === "visit"
        ? "Your Site Visit Request"
        : "Your Property Booking Details";

    const intro = document.createElement("p");
    intro.textContent = "Selected property details from your previous page:";

    summary.append(heading, intro);

    const details = [
        ["Property", params.get("property")],
        ["Price", params.get("price")],
        ["Listing", params.get("type")],
        ["Location", params.get("location")],
        ["Bedrooms", params.get("beds")],
        ["Bathrooms", params.get("baths")],
        ["Area", params.get("sqft")],
        ["Check-in", params.get("checkIn")],
        ["Check-out", params.get("checkOut")],
        ["Visit date", params.get("visitDate")],
        ["Time slot", params.get("slot")]
    ];

    details.forEach(([label, value]) => {
        if (!value) return;

        const line = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;
        line.append(strong, document.createTextNode(value));
        summary.appendChild(line);
    });

    // Add the property image if the supplied path is a local or HTTP image URL.
    const imageUrl = params.get("image") || params.get("img");

    if (
        imageUrl &&
        !imageUrl.startsWith("data:") &&
        !imageUrl.startsWith("javascript:")
    ) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = property;
        image.loading = "lazy";
        image.style.cssText =
            "display:block;width:min(260px,100%);height:160px;object-fit:cover;border-radius:12px;margin:18px 0;";
        summary.appendChild(image);
    }

    const aboutMain = document.querySelector("main");

    if (aboutMain) {
        aboutMain.prepend(summary);
    } else {
        const header = document.querySelector("header");
        if (header) {
            header.insertAdjacentElement("afterend", summary);
        } else {
            document.body.prepend(summary);
        }
    }
}

/* =========================
   17. MODAL HELPERS
   ========================= */

function openModal(modal) {
    if (!modal) return;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}

function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.show")) {
        document.body.classList.remove("no-scroll");
    }
}

function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
/* ==========================================
   STACKLY PROPERTY BOOKING FLOW
   Works with property-details.html + about.html
   ========================================== */

(() => {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) =>
        Array.from(root.querySelectorAll(selector));

    const STORAGE_KEY = "stacklyCurrentBooking";
    const FAVORITES_KEY = "stacklyFavoriteProperty";

    const money = (value) =>
        "₹ " + Number(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 0
        });

    const readBooking = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        } catch {
            return {};
        }
    };

    const saveBooking = (data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const params = new URLSearchParams(window.location.search);

    const textValue = (value, fallback = "") =>
        value !== null && value !== undefined && String(value).trim()
            ? String(value).trim()
            : fallback;

    function getPropertyFromUrl() {
        const image = params.get("img");

        return {
            title: textValue(params.get("title"), "Luxury 3 BHK Villa"),
            type: textValue(params.get("type"), "For Rent"),
            location: textValue(params.get("location"), "Whitefield, Bangalore"),
            beds: textValue(params.get("beds"), "3"),
            baths: textValue(params.get("baths"), "3"),
            sqft: textValue(params.get("sqft"), "2,400"),
            price: textValue(params.get("price"), "25000"),
            image: image ? decodeURIComponentSafe(image) :
                "img/clay-banks-364plyVT2eQ-unsplash.webp",
            description: textValue(
                params.get("description"),
                "A thoughtfully designed property with comfortable interiors and convenient access to essential facilities."
            ),
            amenities: textValue(
                params.get("amenities"),
                "Furnished, Swimming Pool, Power Backup, Gated Community, 24/7 Security, Car Parking"
            )
        };
    }

    function decodeURIComponentSafe(value) {
        try {
            return decodeURIComponent(value);
        } catch {
            return value;
        }
    }

    function numericPrice(value) {
        const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 25000;
    }

    function isForRent(property) {
        return /rent|lease|month/i.test(property.type || "");
    }

    function calculateAmounts(property) {
        const price = numericPrice(property.price);

        // Demo calculation:
        // Rental property: security deposit = 10 months of rent.
        // Sale property: security deposit = 10% of the listed price.
        const deposit = isForRent(property) ? price * 10 : price * 0.10;
        const serviceFee = 5000;
        const total = price + deposit + serviceFee;

        return {
            price,
            deposit,
            serviceFee,
            total,
            currencyPrice: money(price),
            currencyDeposit: money(deposit),
            currencyServiceFee: money(serviceFee),
            currencyTotal: money(total)
        };
    }

    function getCurrentProperty() {
        const saved = readBooking();
        const fromUrl = getPropertyFromUrl();

        // A booking passed from property-details.html takes priority.
        const hasPropertyParams = [
            "title", "price", "type", "location", "img"
        ].some((key) => params.has(key));

        if (hasPropertyParams) {
            return {
                ...fromUrl,
                ...saved,
                ...fromUrl
            };
        }

        return {
            ...fromUrl,
            ...saved
        };
    }

    function getSelectedAmenities() {
        const group = $("#amenitiesCheckboxGroup");

        if (!group) return "";

        return $$('input[type="checkbox"]:checked', group)
            .map((input) => input.value)
            .filter(Boolean)
            .join(", ");
    }

    /* ------------------------------------------
       PRELOADER
       ------------------------------------------ */

    function setupPreloader() {
        const preloader = $("#preloader");
        if (!preloader) return;

        const progressFill = $("#progressFill");
        const progressPercent = $("#progressPercent");
        const ring = $("#loaderRingProgress");

        const circumference = 2 * Math.PI * 70;

        if (ring) {
            ring.style.strokeDasharray = String(circumference);
            ring.style.strokeDashoffset = String(circumference);
        }

        let progress = 0;
        const startTime = Date.now();
        const minimumDisplay = 550;

        function updateProgress(value) {
            const current = Math.min(100, Math.max(0, value));

            if (progressFill) {
                progressFill.style.width = current + "%";
            }

            if (progressPercent) {
                progressPercent.textContent = Math.round(current) + "%";
            }

            if (ring) {
                ring.style.strokeDashoffset =
                    String(circumference * (1 - current / 100));
            }
        }

        updateProgress(0);

        const interval = window.setInterval(() => {
            progress = Math.min(94, progress + Math.random() * 13 + 4);
            updateProgress(progress);
        }, 100);

        const hidePreloader = () => {
            window.clearInterval(interval);

            const wait = Math.max(
                0,
                minimumDisplay - (Date.now() - startTime)
            );

            window.setTimeout(() => {
                updateProgress(100);

                window.setTimeout(() => {
                    preloader.classList.add("preloader-hidden");
                    preloader.setAttribute("aria-hidden", "true");
                }, 200);
            }, wait);
        };

        if (document.readyState === "complete") {
            hidePreloader();
        } else {
            window.addEventListener("load", hidePreloader, { once: true });

            // Prevent the page from being permanently covered if an image
            // or an external resource takes too long to load.
            window.setTimeout(hidePreloader, 2500);
        }
    }

    /* ------------------------------------------
       PROPERTY DETAILS PAGE
       ------------------------------------------ */

    function setupPropertyDetailsPage() {
        const mainImage = $("#mainPropertyImg");
        const titleDisplay = $("#propTitleDisplay");

        if (!mainImage || !titleDisplay) return;

        const propertyImages = [
            "img/clay-banks-364plyVT2eQ-unsplash.webp",
            "img/francesca-tosolini-Gu4R-0lwXvk-unsplash.webp",
            "img/d5-render-O3LR3ZI5Ams-unsplash.webp",
            "img/point3d-commercial-imaging-ltd-hfXcKWPGxQs-unsplash.webp",
            "img/point3d-commercial-imaging-ltd-wc4QVZmAF58-unsplash.webp",
            "img/steven-ungermann-g4zOyqK_QsY-unsplash.webp",
            "img/steven-ungermann-CVTmLMv5oG4-unsplash.webp",
            "img/stephan-bechert-yFV39g6AZ5o-unsplash.webp",
            "img/point3d-commercial-imaging-ltd-xON7AIJZemw-unsplash.webp",
            "img/point3d-commercial-imaging-ltd-zuJLTgQ53_Q-unsplash.webp",
            "img/clay-banks-364plyVT2eQ-unsplash.webp",
            "img/francesca-tosolini-Gu4R-0lwXvk-unsplash.webp"
        ];

        let selectedImageIndex = 0;
        let pendingImageIndex = 0;

        const property = getCurrentProperty();

        function updatePropertyDisplay(data) {
            const setText = (id, value) => {
                const element = $("#" + id);
                if (element) element.textContent = value;
            };

            const title = textValue(data.title, "Luxury 3 BHK Villa");
            const type = textValue(data.type, "For Rent");
            const location = textValue(data.location, "Whitefield, Bangalore");
            const price = numericPrice(data.price);

            setText("propTitleDisplay", title);
            setText("propBadgeDisplay", type);
            setText("propTagDisplay", type);
            setText("propBedsDisplay", textValue(data.beds, "3"));
            setText("propBathsDisplay", textValue(data.baths, "3"));
            setText("propSqftDisplay", textValue(data.sqft, "2,400"));
            setText("propPriceDisplay", price.toLocaleString("en-IN"));
            setText("propDurationDisplay", isForRent(data) ? "/month" : "total");
            setText("propLocationText", "📍 " + location);
            setText("propDescDisplay", textValue(data.description,
                "A thoughtfully designed property with comfortable interiors and convenient access to essential facilities."));
            setText("locationAddressDisplay", location);

            const imagePath = data.image || propertyImages[selectedImageIndex];
            mainImage.src = imagePath;
            mainImage.alt = title;

            const map = $("#propertyMapIframe");
            if (map) {
                map.src =
                    "https://maps.google.com/maps?q=" +
                    encodeURIComponent(location) +
                    "&output=embed";
            }

            const titleInput = $("#bookPropertyTitle");
            if (titleInput) titleInput.value = title;

            const amenitiesGroup = $("#amenitiesCheckboxGroup");
            if (amenitiesGroup && data.amenities) {
                const values = data.amenities
                    .split(",")
                    .map((item) => item.trim());

                $$('input[type="checkbox"]', amenitiesGroup).forEach((input) => {
                    input.checked = values.some((value) =>
                        value.toLowerCase() === input.value.toLowerCase()
                    );
                });
            }
        }

        function renderGallery() {
            const grid = $("#lightboxGridContainer");
            if (!grid) return;

            grid.replaceChildren();

            propertyImages.forEach((src, index) => {
                const option = document.createElement("button");
                option.type = "button";
                option.className = "gallery-option" +
                    (index === pendingImageIndex ? " selected" : "");
                option.setAttribute("aria-pressed",
                    index === pendingImageIndex ? "true" : "false");

                const image = document.createElement("img");
                image.src = src;
                image.alt = "Property photo " + (index + 1);
                image.loading = "lazy";

                const label = document.createElement("span");
                label.textContent = "Photo " + (index + 1);

                option.append(image, label);

                option.addEventListener("click", () => {
                    pendingImageIndex = index;

                    $$(".gallery-option", grid).forEach((item, i) => {
                        item.classList.toggle("selected", i === index);
                        item.setAttribute("aria-pressed",
                            i === index ? "true" : "false");
                    });
                });

                grid.appendChild(option);
            });
        }

        function openModal(modal) {
            if (!modal) return;
            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        }

        function closeModal(modal) {
            if (!modal) return;
            modal.classList.remove("show");
            modal.setAttribute("aria-hidden", "true");

            if (!$(".modal.show")) {
                document.body.classList.remove("modal-open");
            }
        }

        const galleryModal = $("#galleryModal");

        $("#openGalleryModal")?.addEventListener("click", () => {
            pendingImageIndex = selectedImageIndex;
            renderGallery();
            openModal(galleryModal);
        });

        $("#closeGalleryModal")?.addEventListener("click", () => {
            closeModal(galleryModal);
        });

        $("#doneGalleryBtn")?.addEventListener("click", () => {
            selectedImageIndex = pendingImageIndex;

            const thumbnails = $$(".thumbnail-row img");
            if (thumbnails[selectedImageIndex % 3]) {
                thumbnails.forEach((img) => img.classList.remove("active-thumbnail"));
                thumbnails[selectedImageIndex % 3].classList.add("active-thumbnail");
            }

            const updatedProperty = {
                ...getCurrentProperty(),
                image: propertyImages[selectedImageIndex]
            };

            updatePropertyDisplay(updatedProperty);
            closeModal(galleryModal);
        });

        // Keep existing inline onclick="changeImage(this, index)" working.
        window.changeImage = function (element, index) {
            selectedImageIndex = Math.max(
                0,
                Math.min(propertyImages.length - 1, Number(index) || 0)
            );

            mainImage.src = element?.src || propertyImages[selectedImageIndex];

            $$(".thumbnail-row img").forEach((img) =>
                img.classList.remove("active-thumbnail")
            );

            element?.classList.add("active-thumbnail");
        };

        // Keep existing inline onclick="switchTab(...)" working.
        window.switchTab = function (tabName, button) {
            $$(".tab-content").forEach((tab) => tab.classList.remove("active"));
            $$(".tab-btn").forEach((tabButton) =>
                tabButton.classList.remove("active")
            );

            $("#tab-" + tabName)?.classList.add("active");
            button?.classList.add("active");
        };

        function renderAmenities() {
            const list = $("#dynamicAmenitiesList");
            if (!list) return;

            const amenities = [
                ["Furnished", "fa-couch"],
                ["Swimming Pool", "fa-person-swimming"],
                ["Power Backup", "fa-bolt"],
                ["Gated Community", "fa-shield-halved"],
                ["24/7 Security", "fa-video"],
                ["Car Parking", "fa-car"],
                ["High-Speed Wi-Fi", "fa-wifi"],
                ["Fitness Center", "fa-dumbbell"]
            ];

            list.replaceChildren();

            const selected = getSelectedAmenities()
                .split(",")
                .map((item) => item.trim().toLowerCase())
                .filter(Boolean);

            const shown = selected.length
                ? amenities.filter(([name]) =>
                    selected.includes(name.toLowerCase()))
                : amenities;

            if (!shown.length) {
                list.textContent = "No amenities selected.";
                return;
            }

            shown.forEach(([name, iconName]) => {
                const item = document.createElement("span");
                const icon = document.createElement("i");
                icon.className = "fa-solid " + iconName;
                item.append(icon, document.createTextNode(" " + name));
                list.appendChild(item);
            });
        }

        $("#amenitiesCheckboxGroup")?.addEventListener("change", renderAmenities);

        function renderReviews() {
            const list = $("#dynamicReviewsList");
            if (!list) return;

            const reviews = [
                {
                    name: "Arun Kumar",
                    rating: 5,
                    message: "The property details were clear, and the viewing process was convenient."
                },
                {
                    name: "Priya S",
                    rating: 4,
                    message: "Comfortable layout and helpful property support."
                },
                {
                    name: "Karthik R",
                    rating: 5,
                    message: "The location and amenities matched my expectations."
                }
            ];

            list.replaceChildren();

            reviews.forEach((review) => {
                const card = document.createElement("div");
                card.className = "review-card";

                const heading = document.createElement("strong");
                heading.textContent = review.name + " ";

                const stars = document.createElement("span");
                stars.style.color = "#d49a24";
                stars.textContent = "★".repeat(review.rating);

                const paragraph = document.createElement("p");
                paragraph.textContent = review.message;

                card.append(heading, stars, paragraph);
                list.appendChild(card);
            });
        }

        const bookingModal = $("#bookModal");
        const scheduleModal = $("#scheduleModal");

        $("#openBookModal")?.addEventListener("click", () => {
            const titleInput = $("#bookPropertyTitle");
            if (titleInput) {
                titleInput.value = $("#propTitleDisplay")?.textContent || "";
            }
            openModal(bookingModal);
        });

        $("#closeBookModal")?.addEventListener("click", () =>
            closeModal(bookingModal)
        );

        $("#openScheduleModal")?.addEventListener("click", () =>
            openModal(scheduleModal)
        );

        $("#closeScheduleModal")?.addEventListener("click", () =>
            closeModal(scheduleModal)
        );

        $$(".modal").forEach((modal) => {
            modal.addEventListener("click", (event) => {
                if (event.target === modal) closeModal(modal);
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                $$(".modal.show").forEach(closeModal);
            }
        });

        // Booking from the property page transfers the selected property
        // and guest details to about.html.
        $("#bookingForm")?.addEventListener("submit", (event) => {
            event.preventDefault();

            const selected = getCurrentProperty();
            const data = {
                ...selected,
                title: $("#propTitleDisplay")?.textContent || selected.title,
                type: $("#propBadgeDisplay")?.textContent || selected.type,
                location: $("#locationAddressDisplay")?.textContent ||
                    $("#propLocationText")?.textContent?.replace("📍 ", "") ||
                    selected.location,
                beds: $("#propBedsDisplay")?.textContent || selected.beds,
                baths: $("#propBathsDisplay")?.textContent || selected.baths,
                sqft: $("#propSqftDisplay")?.textContent || selected.sqft,
                price: $("#propPriceDisplay")?.textContent || selected.price,
                image: $("#mainPropertyImg")?.getAttribute("src") || selected.image,
                amenities: getSelectedAmenities(),
                guestName: $("#bookName")?.value.trim() || "",
                guestPhone: $("#bookContact")?.value.trim() || "",
                guestWork: $("#bookWork")?.value.trim() || "",
                guestSalary: $("#bookSalary")?.value || "",
                checkIn: $("#bookCheckIn")?.value || "",
                checkOut: $("#bookCheckOut")?.value || ""
            };

            if (!data.guestName || !data.guestPhone || !data.guestWork ||
                !data.guestSalary || !data.checkIn || !data.checkOut) {
                alert("Please complete all booking fields.");
                return;
            }

            if (data.checkOut <= data.checkIn) {
                alert("Check-out date must be later than check-in date.");
                return;
            }

            saveBooking(data);
            window.location.href = "about.html";
        });

        $("#scheduleForm")?.addEventListener("submit", (event) => {
            event.preventDefault();

            const visit = {
                name: $("#schedName")?.value.trim() || "",
                phone: $("#schedPhone")?.value.trim() || "",
                date: $("#schedDate")?.value || "",
                slot: $("#schedSlot")?.value || "",
                property: $("#propTitleDisplay")?.textContent || ""
            };

            saveBooking({
                ...readBooking(),
                visit
            });

            alert(
                "Demo visit request saved!\n" +
                "Property: " + visit.property + "\n" +
                "Date: " + visit.date + "\n" +
                "Time: " + visit.slot
            );

            closeModal(scheduleModal);
        });

        updatePropertyDisplay(property);
        renderAmenities();
        renderReviews();
    }

    /* ------------------------------------------
       ABOUT & BOOKING PAGE
       ------------------------------------------ */

    let currentStep = 1;
    let paymentCategory = 2;
    let currentBooking = {};
    let currentAmounts = {};
    let paymentCompleted = false;

    function setupAboutBookingPage() {
        if (!$("#bookingSection1")) return;

        const saved = readBooking();
        const propertyFromUrl = getPropertyFromUrl();

        currentBooking = {
            ...propertyFromUrl,
            ...saved
        };

        currentAmounts = calculateAmounts(currentBooking);

        // Set a default image when no property has been passed yet.
        if (!currentBooking.image) {
            currentBooking.image =
                "img/clay-banks-364plyVT2eQ-unsplash.webp";
        }

        const image = $("#flowPropImg");
        if (image) {
            image.src = currentBooking.image;
            image.alt = currentBooking.title || "Selected property";
        }

        const setText = (id, value) => {
            const element = $("#" + id);
            if (element) element.textContent = value;
        };

        setText("flowPropTitle", currentBooking.title || "Luxury 3 BHK Villa");
        setText("flowPropLoc", currentBooking.location || "Whitefield, Bangalore");
        setText("flowPropBeds", currentBooking.beds || "3");
        setText("flowPropBaths", currentBooking.baths || "3");
        setText("flowPropSqft", currentBooking.sqft || "2,400");

        const rentLabel = $("#rentLabel");
        if (rentLabel) {
            rentLabel.textContent = isForRent(currentBooking)
                ? "Monthly Rent"
                : "Property Price";
        }

        setText("flowPropPrice",
            currentAmounts.currencyPrice +
            (isForRent(currentBooking) ? " /month" : " total"));

        setText("detType", currentBooking.type || "Villa");
        setText("detDesc", currentBooking.description ||
            "A thoughtfully designed property with convenient amenities.");
        setText("detAmenities", currentBooking.amenities ||
            "Furnished, Swimming Pool, Security, Parking");

        setText("sumType", currentBooking.type || "Villa");
        setText("sumLoc", currentBooking.location || "Whitefield, Bangalore");
        setText("sumDeposit", currentAmounts.currencyDeposit);
        setText("sumRent", currentAmounts.currencyPrice);
        setText("breakdownDeposit", currentAmounts.currencyDeposit);
        setText("breakdownService", currentAmounts.currencyServiceFee);
        setText("totalPayableAmt", currentAmounts.currencyTotal);

        setText("cat1PayNow", money(currentAmounts.total / 2));
        setText("cat1DueLater", money(currentAmounts.total / 2));
        setText("cat2PayNow", currentAmounts.currencyTotal);

        // Fill in guest information that was entered in the property modal.
        const guestFields = [
            ["guestName", currentBooking.guestName],
            ["guestPhone", currentBooking.guestPhone],
            ["guestWork", currentBooking.guestWork],
            ["guestSalary", currentBooking.guestSalary],
            ["checkInDate", currentBooking.checkIn],
            ["checkOutDate", currentBooking.checkOut]
        ];

        guestFields.forEach(([id, value]) => {
            const field = $("#" + id);
            if (field && value) field.value = value;
        });

        // Set a sensible minimum for date inputs.
        const today = new Date();
        const localToday = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        ["checkInDate", "checkOutDate"].forEach((id) => {
            const field = $("#" + id);
            if (field) field.min = localToday;
        });

        if (currentBooking.specialRequests) {
            const special = $("#specialReq");
            if (special) special.value = currentBooking.specialRequests;
        }

        // Open the details panel if the user arrived from the property booking modal.
        if (currentBooking.guestName) {
            setDetailsExpanded(true);
        }

        // Make the initial payment choice match the HTML default.
        window.selectPaymentCategory(2);

        $("#proceedToPayBtn")?.addEventListener("click", () => {
            if (!validateBookingDetails()) return;

            collectBookingDetails();
            switchStep(2);
        });

        $("#confirmPaymentBtn")?.addEventListener("click", () => {
            if (!validateBookingDetails()) {
                switchStep(1);
                return;
            }

            collectBookingDetails();

            const confirmed = window.confirm(
                paymentCategory === 1
                    ? "Demo confirmation: record the 50% advance now and the remaining balance due within 30 days?"
                    : "Demo confirmation: record the full payment for this property?"
            );

            if (!confirmed) return;

            paymentCompleted = true;
            currentBooking.paymentCategory = paymentCategory;
            currentBooking.paymentTotal = currentAmounts.total;
            currentBooking.payNow = paymentCategory === 1
                ? currentAmounts.total / 2
                : currentAmounts.total;
            currentBooking.balanceDue = paymentCategory === 1
                ? currentAmounts.total / 2
                : 0;

            currentBooking.paymentStatus = paymentCategory === 1
                ? "50% advance recorded — balance due within 30 days"
                : "Demo payment marked as paid in full";

            currentBooking.paymentDate = new Date().toLocaleDateString("en-IN");

            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 30);
            currentBooking.dueDate = paymentCategory === 1
                ? dueDate.toLocaleDateString("en-IN")
                : "No balance due";

            currentBooking.bookingReference =
                "STK-" + Date.now().toString().slice(-8);

            saveBooking(currentBooking);
            renderReceipt();
            switchStep(3);
        });

        // Avoid clicking future wizard steps before requirements are met.
        $("#stepIndicator1")?.addEventListener("click", () => switchStep(1));
        $("#stepIndicator2")?.addEventListener("click", () => {
            if (currentStep >= 2) {
                switchStep(2);
            } else if (validateBookingDetails()) {
                collectBookingDetails();
                switchStep(2);
            }
        });
        $("#stepIndicator3")?.addEventListener("click", () => {
            if (paymentCompleted) switchStep(3);
        });

        // If the user changes dates, revalidate checkout ordering.
        $("#checkInDate")?.addEventListener("change", () => {
            const checkIn = $("#checkInDate");
            const checkOut = $("#checkOutDate");
            if (checkIn && checkOut) {
                checkOut.min = checkIn.value || checkIn.min;
            }
        });
    }

    function setDetailsExpanded(expanded) {
        const panel = $("#expandableDetailsBox");
        const text = $("#viewDetailsText");
        const icon = $("#viewIcon");

        if (panel) panel.style.display = expanded ? "block" : "none";
        if (text) text.textContent = expanded ? "Hide Full Details" : "View Full Details";
        if (icon) icon.classList.toggle("rotated", expanded);
    }

    // Preserve the existing inline onclick="toggleDetailsView()".
    window.toggleDetailsView = function () {
        const panel = $("#expandableDetailsBox");
        const expanded = panel && panel.style.display !== "none";
        setDetailsExpanded(!expanded);
    };

    function validateBookingDetails() {
        const fields = [
            ["guestName", "Please enter your full name."],
            ["guestPhone", "Please enter your phone number."],
            ["guestWork", "Please enter your occupation."],
            ["guestSalary", "Please enter your monthly salary."],
            ["checkInDate", "Please select your check-in date."],
            ["checkOutDate", "Please select your checkout date."],
            ["specialReq", "Please enter your special requests."]
        ];

        const panel = $("#expandableDetailsBox");
        if (panel) setDetailsExpanded(true);

        for (const [id, message] of fields) {
            const field = $("#" + id);

            if (!field || !String(field.value || "").trim()) {
                alert(message);
                field?.focus();
                return false;
            }
        }

        const salary = Number($("#guestSalary")?.value || 0);
        if (salary <= 0) {
            alert("Please enter a valid monthly salary.");
            $("#guestSalary")?.focus();
            return false;
        }

        const checkIn = $("#checkInDate")?.value;
        const checkOut = $("#checkOutDate")?.value;

        if (checkIn < new Date().toISOString().slice(0, 10)) {
            alert("Check-in date cannot be in the past.");
            $("#checkInDate")?.focus();
            return false;
        }

        if (checkOut <= checkIn) {
            alert("Checkout date must be later than check-in date.");
            $("#checkOutDate")?.focus();
            return false;
        }

        const error = $("#reqErrorMsg");
        if (error) error.style.display = "none";

        return true;
    }

    function collectBookingDetails() {
        currentBooking = {
            ...currentBooking,
            guestName: $("#guestName")?.value.trim() || "",
            guestPhone: $("#guestPhone")?.value.trim() || "",
            guestWork: $("#guestWork")?.value.trim() || "",
            guestSalary: $("#guestSalary")?.value || "",
            checkIn: $("#checkInDate")?.value || "",
            checkOut: $("#checkOutDate")?.value || "",
            specialRequests: $("#specialReq")?.value.trim() || ""
        };

        saveBooking(currentBooking);
    }

    // Keep existing inline onclick="switchStep(number)" working.
    window.switchStep = function (step) {
        const requestedStep = Number(step);

        if (![1, 2, 3].includes(requestedStep)) return;

        if (requestedStep === 2 && currentStep < 2) {
            if (!validateBookingDetails()) return;
            collectBookingDetails();
        }

        if (requestedStep === 3 && !paymentCompleted) {
            alert("Please complete the payment confirmation first.");
            return;
        }

        const stepChanged = requestedStep !== currentStep;
        currentStep = requestedStep;

        [1, 2, 3].forEach((number) => {
            const section = $("#bookingSection" + number);
            const indicator = $("#stepIndicator" + number);

            section?.classList.toggle("active", number === currentStep);

            if (indicator) {
                indicator.classList.toggle("active", number === currentStep);
                indicator.classList.toggle("completed", number < currentStep);
            }
        });

        const bookingContainer = $(".booking-flow-container");
        if (stepChanged && bookingContainer) {
            bookingContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    // Keep existing inline onclick="selectPaymentCategory(number)" working.
    window.selectPaymentCategory = function (category) {
        paymentCategory = Number(category) === 1 ? 1 : 2;

        $("#payCat1")?.classList.toggle("selected", paymentCategory === 1);
        $("#payCat2")?.classList.toggle("selected", paymentCategory === 2);

        const button = $("#confirmPaymentBtn");
        if (button) {
            button.innerHTML = paymentCategory === 1
                ? 'Confirm 50% Advance <i class="fa-solid fa-shield-halved"></i>'
                : 'Confirm Full Payment <i class="fa-solid fa-shield-halved"></i>';
        }
    };

    function renderReceipt() {
        const container = $("#receiptCardDetails");
        if (!container) return;

        const rows = [
            ["Booking Reference", currentBooking.bookingReference],
            ["Property", currentBooking.title],
            ["Property Type", currentBooking.type],
            ["Location", currentBooking.location],
            ["Guest Name", currentBooking.guestName],
            ["Phone", currentBooking.guestPhone],
            ["Occupation", currentBooking.guestWork],
            ["Monthly Salary", money(currentBooking.guestSalary)],
            ["Check-in", currentBooking.checkIn],
            ["Checkout", currentBooking.checkOut],
            ["Special Requests", currentBooking.specialRequests],
            ["Property Price", currentAmounts.currencyPrice],
            ["Security Deposit", currentAmounts.currencyDeposit],
            ["Service Fee", currentAmounts.currencyServiceFee],
            ["Total Booking Amount", currentAmounts.currencyTotal],
            ["Payment Category", paymentCategory === 1
                ? "Half Payment — 50% Advance"
                : "Full Payment — 100%"],
            ["Paid / Recorded Now", money(currentBooking.payNow)],
            ["Balance Due", money(currentBooking.balanceDue)],
            ["Balance Due Date", currentBooking.dueDate],
            ["Payment Date", currentBooking.paymentDate]
        ];

        container.replaceChildren();

        const status = document.createElement("div");
        status.className = "receipt-status";
        status.textContent = currentBooking.paymentStatus || "Booking confirmed";
        container.appendChild(status);

        rows.forEach(([label, value]) => {
            const row = document.createElement("div");
            row.className = "receipt-row";

            const left = document.createElement("span");
            left.textContent = label;

            const right = document.createElement("strong");
            right.textContent = value || "—";

            row.append(left, right);
            container.appendChild(row);
        });

        const serviceLink = document.createElement("a");
        serviceLink.href = "services.html";
        serviceLink.className = "btn-proceed-pay";
        serviceLink.style.textDecoration = "none";
        serviceLink.textContent = "Continue to Services";

        const buttonRow = $(".receipt-buttons-row");
        if (buttonRow && !buttonRow.querySelector(".booking-service-link")) {
            serviceLink.classList.add("booking-service-link");
            buttonRow.appendChild(serviceLink);
        }

        saveBooking(currentBooking);
    }

    /* ------------------------------------------
       WISHLIST
       ------------------------------------------ */

    function setupWishlist() {
        const button = $("#wishlistBtn");
        const icon = $(".wishlist-icon");
        const count = $("#wishlistCount");

        if (!button || !icon || !count) return;

        let favorite = localStorage.getItem(FAVORITES_KEY) === "true";

        function renderFavorite() {
            icon.style.color = favorite ? "#e53935" : "#9ca3af";
            count.textContent = favorite ? "1" : "0";
            button.setAttribute("aria-pressed", String(favorite));
        }

        button.style.cursor = "pointer";
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");

        const toggleFavorite = () => {
            favorite = !favorite;
            localStorage.setItem(FAVORITES_KEY, String(favorite));
            renderFavorite();
        };

        button.addEventListener("click", toggleFavorite);
        button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleFavorite();
            }
        });

        renderFavorite();
    }

    /* ------------------------------------------
       INITIALIZE
       ------------------------------------------ */

    document.addEventListener("DOMContentLoaded", () => {
        setupPreloader();
        setupWishlist();
        setupPropertyDetailsPage();
        setupAboutBookingPage();
    });
})();
/* =========================================
   STACKLY SERVICES & BOOKINGS
   File: js/main.js
========================================= */

(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", initServicesPage);

    function initServicesPage() {
        setupPreloader();
        setupUserProfile();
        setupWishlist();
        setupBookings();
        setupBookingModal();
        setupToast();
    }

    /* ---------- Helpers ---------- */

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    function safeReadStorage(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.warn(`Could not read localStorage key "${key}".`, error);
            return null;
        }
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }

    function parseAmount(value) {
        if (typeof value === "number") {
            return Number.isFinite(value) ? value : 0;
        }

        const parsed = Number(String(value ?? "").replace(/[₹,\s]/g, ""));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function formatMoney(value) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(parseAmount(value));
    }

    function formatDate(value) {
        if (!value) return "Not provided";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    /* ---------- Preloader ---------- */

    function setupPreloader() {
        const preloader = $("#preloader");

        if (!preloader) return;

        const ring = $("#loaderRingProgress");
        const fill = $("#progressFill");
        const percent = $("#progressPercent");

        const circumference = 2 * Math.PI * 70;
        let progress = 0;
        let finished = false;

        if (ring) {
            ring.style.strokeDasharray = String(circumference);
            ring.style.strokeDashoffset = String(circumference);
        }

        function updateProgress(value) {
            progress = Math.max(0, Math.min(100, value));

            if (percent) {
                percent.textContent = `${Math.round(progress)}%`;
            }

            if (fill) {
                fill.style.width = `${progress}%`;
            }

            if (ring) {
                ring.style.strokeDashoffset =
                    String(circumference * (1 - progress / 100));
            }
        }

        function hidePreloader() {
            if (finished) return;
            finished = true;

            updateProgress(100);

            window.setTimeout(() => {
                preloader.classList.add("is-hidden");
                preloader.setAttribute("aria-hidden", "true");
            }, 180);
        }

        const startTime = Date.now();
        const progressTimer = window.setInterval(() => {
            if (finished) {
                window.clearInterval(progressTimer);
                return;
            }

            const elapsed = Date.now() - startTime;
            updateProgress(Math.min(90, (elapsed / 900) * 90));
        }, 35);

        function finish() {
            window.clearInterval(progressTimer);
            hidePreloader();
        }

        if (document.readyState === "complete") {
            finish();
        } else {
            window.addEventListener("load", finish, { once: true });
        }

        // Safety fallback: a slow image or external resource must not
        // leave the page covered by the loader indefinitely.
        window.setTimeout(finish, 2500);
    }

    /* ---------- User profile ---------- */

    function setupUserProfile() {
        const possibleKeys = [
            "stacklyUser",
            "loggedInUser",
            "currentUser",
            "user"
        ];

        let user = null;

        for (const key of possibleKeys) {
            const candidate = safeReadStorage(key);

            if (candidate && typeof candidate === "object") {
                user = candidate;
                break;
            }
        }

        if (!user) return;

        const name =
            user.name ||
            user.fullName ||
            user.username ||
            user.full_name ||
            user.email ||
            "Guest";

        setText("loggedUserName", name);
        setText("userInitialAvatar", String(name).trim().charAt(0).toUpperCase() || "G");
    }

    /* ---------- Wishlist count ---------- */

    function setupWishlist() {
        const wishlistButton = $("#wishlistBtn");

        const keys = [
            "stacklyWishlist",
            "stacklyFavorites",
            "stacklyWishlistItems"
        ];

        let wishlist = null;

        for (const key of keys) {
            const value = safeReadStorage(key);

            if (Array.isArray(value)) {
                wishlist = value;
                break;
            }

            if (value && typeof value === "object") {
                wishlist = value.items || value.favorites || null;

                if (Array.isArray(wishlist)) break;
            }
        }

        setText("wishlistCount", Array.isArray(wishlist) ? wishlist.length : 0);

        if (wishlistButton) {
            wishlistButton.addEventListener("click", () => {
                showToast(
                    "Your favourites count is shown here. Connect your favourites page to open the saved properties."
                );
            });
        }
    }

    /* ---------- Bookings ---------- */

    let allBookings = [];
    let activeCategory = "upcoming";
    let selectedBooking = null;

    function getStoredBookings() {
        const keys = [
            "stacklyAllBookings",
            "stacklyBookingData"
        ];

        for (const key of keys) {
            const value = safeReadStorage(key);

            if (Array.isArray(value)) return value;

            if (value && typeof value === "object") {
                if (Array.isArray(value.bookings)) return value.bookings;
                if (Array.isArray(value.data)) return value.data;
                if (value.booking && typeof value.booking === "object") {
                    return [value.booking];
                }
            }
        }

        return [];
    }

    function normalizeBooking(booking, index) {
        const item = booking && typeof booking === "object" ? booking : {};

        const title =
            item.propertyTitle ||
            item.propertyName ||
            item.title ||
            item.name ||
            item.property ||
            "Property booking";

        const rawStatus = String(
            item.status || item.bookingStatus || "pending"
        ).toLowerCase();

        const status = rawStatus.includes("cancel")
            ? "cancelled"
            : rawStatus.includes("confirm") || rawStatus === "approved"
                ? "confirmed"
                : rawStatus;

        const price = parseAmount(
            item.price ?? item.propertyPrice ?? item.totalPrice ?? item.amount ?? 0
        );

        const paid = parseAmount(
            item.amountPaid ?? item.paidAmount ?? item.paid ?? 0
        );

        const checkIn = item.checkIn || item.checkInDate || item.startDate || "";
        const checkOut = item.checkOut || item.checkOutDate || item.endDate || "";

        return {
            id: String(item.id || item.bookingId || item.reference || `booking-${index + 1}`),
            title: String(title),
            location: String(item.location || item.address || item.city || "Location not provided"),
            guest: String(item.guestName || item.fullName || item.nameOfGuest || item.customerName || "Not provided"),
            contact: String(item.phone || item.phoneNumber || item.contact || item.email || "Not provided"),
            price,
            paid,
            balance: Math.max(0, parseAmount(item.balanceDue ?? item.balance ?? (price - paid))),
            status,
            paymentStatus: String(item.paymentStatus || item.payment_status || (paid > 0 ? "Recorded" : "Not recorded")),
            checkIn,
            checkOut,
            reference: String(item.bookingReference || item.reference || item.bookingId || `STK-${index + 1}`),
            category: getBookingCategory(status, checkIn, checkOut)
        };
    }

    function getBookingCategory(status, checkIn, checkOut) {
        if (status === "cancelled" || status === "canceled") {
            return "cancelled";
        }

        const dateValue = checkOut || checkIn;

        if (dateValue) {
            const date = new Date(dateValue);

            if (!Number.isNaN(date.getTime())) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);

                if (date < today) return "past";
            }
        }

        return "upcoming";
    }

    function setupBookings() {
        allBookings = getStoredBookings().map(normalizeBooking);
        updateBookingSummary();
        setupBookingTabs();
        renderBookings();
    }

    function updateBookingSummary() {
        setText("totalBookingsCount", allBookings.length);

        setText(
            "confirmedBookingsCount",
            allBookings.filter(booking => booking.status === "confirmed").length
        );

        setText(
            "paidAmountTotal",
            formatMoney(allBookings.reduce((sum, booking) => sum + booking.paid, 0))
        );

        setText("upcomingCount", allBookings.filter(item => item.category === "upcoming").length);
        setText("pastCount", allBookings.filter(item => item.category === "past").length);
        setText("cancelledCount", allBookings.filter(item => item.category === "cancelled").length);
        setText("allBookingsCount", allBookings.length);
    }

    function setupBookingTabs() {
        $$(".tab-filter-btn").forEach(button => {
            button.addEventListener("click", () => {
                activeCategory = button.dataset.category || "upcoming";

                $$(".tab-filter-btn").forEach(tab => {
                    const active = tab === button;
                    tab.classList.toggle("active", active);
                    tab.setAttribute("aria-selected", String(active));
                });

                renderBookings();
            });
        });
    }

    function renderBookings() {
        const container = $("#bookingsListContainer");
        if (!container) return;

        const bookings = activeCategory === "all"
            ? allBookings
            : allBookings.filter(item => item.category === activeCategory);

        if (!bookings.length) {
            container.innerHTML = `
                <div class="empty-bookings">
                    <i class="fa-regular fa-calendar-xmark" aria-hidden="true"></i>
                    <h3>No bookings to show</h3>
                    <p>
                        ${allBookings.length
                            ? "There are no bookings in this category."
                            : "Your booking form has not saved any bookings yet. Visit Products to explore properties."}
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = bookings.map((booking, index) => {
            const statusClass = booking.status.includes("cancel")
                ? "cancelled"
                : booking.status === "confirmed"
                    ? "confirmed"
                    : "pending";

            return `
                <article class="booking-card">
                    <div class="booking-card-main">
                        <h3>${escapeHTML(booking.title)}</h3>
                        <p><i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                            ${escapeHTML(booking.location)}</p>
                        <p>Reference: ${escapeHTML(booking.reference)}</p>
                        <div class="booking-card-meta">
                            <span class="booking-status-pill ${statusClass}">
                                ${escapeHTML(booking.status)}
                            </span>
                            <span class="booking-status-pill">
                                Payment: ${escapeHTML(booking.paymentStatus)}
                            </span>
                        </div>
                    </div>
                    <div class="booking-card-side">
                        <span class="booking-card-price">${formatMoney(booking.price)}</span>
                        <button type="button" class="booking-details-btn" data-booking-index="${index}"
                                data-booking-id="${escapeHTML(booking.id)}">
                            View Details
                        </button>
                    </div>
                </article>
            `;
        }).join("");

        $$(".booking-details-btn", container).forEach(button => {
            button.addEventListener("click", () => {
                const booking = allBookings.find(
                    item => item.id === button.dataset.bookingId
                );

                if (booking) openBookingModal(booking);
            });
        });
    }

    /* ---------- Booking modal ---------- */

    function setupBookingModal() {
        const modal = $("#bookingDetailsModal");
        if (!modal) return;

        const closeButton = $("#modalCloseButton");
        const xButton = $("#modalXButton");
        const agreementButton = $("#modalAgreementButton");

        function closeModal() {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("services-modal-open");
            selectedBooking = null;
        }

        if (closeButton) closeButton.addEventListener("click", closeModal);
        if (xButton) xButton.addEventListener("click", closeModal);

        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && modal.classList.contains("is-open")) {
                closeModal();
            }
        });

        if (agreementButton) {
            agreementButton.addEventListener("click", downloadBookingSummary);
        }
    }

    function openBookingModal(booking) {
        const modal = $("#bookingDetailsModal");
        if (!modal) return;

        selectedBooking = booking;

        setText("modalPropTitle", booking.title);
        setText("modalPropLoc", booking.location);
        setText("modalBookingStatus", booking.status);
        setText("modalGuestName", booking.guest);
        setText("modalGuestContact", booking.contact);
        setText("modalPropPrice", formatMoney(booking.price));
        setText("modalPaymentStatus", booking.paymentStatus);
        setText("modalAmountPaid", formatMoney(booking.paid));
        setText("modalBalanceDue", formatMoney(booking.balance));
        setText("modalCheckIn", formatDate(booking.checkIn));
        setText("modalCheckOut", formatDate(booking.checkOut));
        setText("modalBookingReference", booking.reference);
        setText(
            "modalPaymentNote",
            "Payment information reflects data saved by your booking form. It does not verify a real transaction."
        );

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("services-modal-open");

        const closeButton = $("#modalCloseButton");
        if (closeButton) closeButton.focus();
    }

    function downloadBookingSummary() {
        if (!selectedBooking) {
            showToast("Please select a booking first.");
            return;
        }

        const booking = selectedBooking;

        const content = [
            "STACKLY REAL ESTATE — BOOKING SUMMARY",
            "-------------------------------------",
            `Property: ${booking.title}`,
            `Location: ${booking.location}`,
            `Guest: ${booking.guest}`,
            `Contact: ${booking.contact}`,
            `Booking reference: ${booking.reference}`,
            `Booking status: ${booking.status}`,
            `Property price: ${formatMoney(booking.price)}`,
            `Amount recorded as paid: ${formatMoney(booking.paid)}`,
            `Balance recorded: ${formatMoney(booking.balance)}`,
            `Payment status: ${booking.paymentStatus}`,
            `Check-in: ${formatDate(booking.checkIn)}`,
            `Check-out: ${formatDate(booking.checkOut)}`,
            "",
            "This is a locally generated booking summary, not a legal agreement,",
            "payment receipt, or confirmation of a real transaction."
        ].join("\n");

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = url;
        downloadLink.download = `Stackly-${booking.reference}-summary.txt`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        URL.revokeObjectURL(url);
        showToast("Booking summary download started.");
    }

    /* ---------- Toast ---------- */

    let toastTimer = null;

    function setupToast() {
        // Toast is created in HTML; no setup is required.
    }

    function showToast(message) {
        const toast = $("#servicesToast");
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        if (toastTimer) window.clearTimeout(toastTimer);

        toastTimer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    }

})();

/* =========================================
   STACKLY REAL ESTATE - CONTACT PAGE
   File: js/contact.js
========================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "stacklyContactMessages";
    let toastTimer = null;

    document.addEventListener("DOMContentLoaded", initializeContactPage);

    function initializeContactPage() {
        setupContactPreloader();
        setupContactForm();
        setupWishlist();
        setActiveNavigation();
    }

    /* -----------------------------------------
       PRELOADER
       Note: If js/main.js already controls this
       same preloader, remove its duplicate loader
       logic from one of the two files.
    ----------------------------------------- */

    function setupContactPreloader() {
        const preloader = document.getElementById("preloader");

        if (!preloader) return;

        // Avoid starting a second loader animation.
        if (preloader.dataset.contactLoaderStarted === "true") {
            return;
        }

        preloader.dataset.contactLoaderStarted = "true";

        const ring = document.getElementById("loaderRingProgress");
        const fill = document.getElementById("progressFill");
        const percent = document.getElementById("progressPercent");

        const circumference = 2 * Math.PI * 70;
        const duration = 1200;
        const startTime = performance.now();

        if (ring) {
            ring.style.strokeDasharray = String(circumference);
            ring.style.strokeDashoffset = String(circumference);
        }

        let completed = false;

        function finishLoader() {
            if (completed) return;

            completed = true;

            if (fill) fill.style.width = "100%";
            if (percent) percent.textContent = "100%";

            if (ring) ring.style.strokeDashoffset = "0";

            window.setTimeout(function () {
                preloader.classList.add("is-hidden");
                preloader.setAttribute("aria-hidden", "true");
            }, 200);
        }

        function updateProgress(now) {
            if (completed) return;

            const progress = Math.min(
                100,
                Math.round(((now - startTime) / duration) * 100)
            );

            if (fill) {
                fill.style.width = progress + "%";
            }

            if (percent) {
                percent.textContent = progress + "%";
            }

            if (ring) {
                ring.style.strokeDashoffset =
                    String(circumference * (1 - progress / 100));
            }

            if (progress >= 100) {
                finishLoader();
            } else {
                requestAnimationFrame(updateProgress);
            }
        }

        requestAnimationFrame(updateProgress);

        // Safety fallback: never leave the page covered indefinitely.
        window.setTimeout(finishLoader, 3500);
    }

    /* -----------------------------------------
       CONTACT FORM
       Saves demo messages in this browser only.
       It does NOT send an email.
    ----------------------------------------- */

    function setupContactForm() {
        const form = document.getElementById("contactForm");

        if (!form) return;

        form.addEventListener("submit", submitContactForm);
    }

    function submitContactForm(event) {
        event.preventDefault();

        const form = document.getElementById("contactForm");

        if (!form) return;

        const nameInput = document.getElementById("contactName");
        const emailInput = document.getElementById("contactEmail");
        const subjectInput = document.getElementById("contactSubject");
        const messageInput = document.getElementById("contactMsg");

        const status = getOrCreateFormStatus(form);
        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const subject = subjectInput ? subjectInput.value.trim() : "";
        const message = messageInput ? messageInput.value.trim() : "";

        clearFormStatus(status);

        if (!name || !email || !subject || !message) {
            showFormStatus(
                status,
                "Please complete all fields before sending your message.",
                "error"
            );
            return;
        }

        if (!isValidEmail(email)) {
            showFormStatus(
                status,
                "Please enter a valid email address.",
                "error"
            );

            if (emailInput) emailInput.focus();
            return;
        }

        const record = {
            id: createMessageId(),
            name: name,
            email: email,
            subject: subject,
            message: message,
            createdAt: new Date().toISOString(),
            status: "Received locally"
        };

        let existingMessages = [];

        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    existingMessages = parsed;
                }
            }

            existingMessages.push(record);

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(existingMessages)
            );
        } catch (error) {
            console.error("Contact form storage error:", error);

            showFormStatus(
                status,
                "Your message could not be saved in this browser. Please try again.",
                "error"
            );

            showToast("Message could not be saved.", true);
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Message Saved";
        }

        showFormStatus(
            status,
            "Thank you, " + name +
            ". Your message has been saved in this browser for demo purposes. " +
            "No email has been sent.",
            "success"
        );

        showToast("Your message was saved successfully.");

        form.reset();

        window.setTimeout(function () {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = "Send Message";
            }
        }, 1200);
    }

    function getOrCreateFormStatus(form) {
        let status = document.getElementById("contactFormStatus");

        if (!status) {
            status = document.createElement("div");
            status.id = "contactFormStatus";
            status.className = "contact-form-status";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");
            form.appendChild(status);
        }

        return status;
    }

    function showFormStatus(element, message, type) {
        if (!element) return;

        element.textContent = message;
        element.classList.remove("is-success", "is-error");
        element.classList.add(
            type === "success" ? "is-success" : "is-error"
        );
    }

    function clearFormStatus(element) {
        if (!element) return;

        element.textContent = "";
        element.classList.remove("is-success", "is-error");
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function createMessageId() {
        return "MSG-" +
            Date.now().toString(36).toUpperCase() +
            "-" +
            Math.random().toString(36).slice(2, 6).toUpperCase();
    }

    /* -----------------------------------------
       WISHLIST COUNT
       Reads supported local browser storage keys.
    ----------------------------------------- */

    function setupWishlist() {
        const countElement = document.getElementById("wishlistCount");
        const wishlistButton = document.getElementById("wishlistBtn");

        updateWishlistCount();

        if (wishlistButton) {
            wishlistButton.addEventListener("click", function () {
                showToast(
                    "Your wishlist count is displayed here. " +
                    "A wishlist page must be connected separately."
                );
            });
        }

        window.addEventListener("storage", function (event) {
            if (
                !event.key ||
                [
                    "stacklyWishlist",
                    "stacklyFavorites",
                    "stacklyWishlistItems"
                ].includes(event.key)
            ) {
                updateWishlistCount();
            }
        });

        function updateWishlistCount() {
            if (!countElement) return;

            const keys = [
                "stacklyWishlist",
                "stacklyFavorites",
                "stacklyWishlistItems"
            ];

            let count = 0;

            for (const key of keys) {
                try {
                    const value = localStorage.getItem(key);

                    if (!value) continue;

                    const parsed = JSON.parse(value);

                    if (Array.isArray(parsed)) {
                        count = parsed.length;
                        break;
                    }

                    if (parsed && typeof parsed === "object") {
                        if (Array.isArray(parsed.items)) {
                            count = parsed.items.length;
                            break;
                        }

                        count = Object.keys(parsed).length;
                        break;
                    }
                } catch (error) {
                    console.warn("Could not read wishlist data:", error);
                }
            }

            countElement.textContent = String(count);
        }
    }

    /* -----------------------------------------
       ACTIVE NAVIGATION
    ----------------------------------------- */

    function setActiveNavigation() {
        const currentFile = window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

        document.querySelectorAll(".nav-links a").forEach(function (link) {
            const href = link.getAttribute("href");

            if (!href) return;

            const linkFile = href.split("/").pop().toLowerCase();

            if (linkFile === currentFile) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            } else {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
            }
        });
    }

    /* -----------------------------------------
       TOAST MESSAGE
    ----------------------------------------- */

    function showToast(message, isError) {
        let toast = document.getElementById("contactToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "contactToast";
            toast.className = "contact-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.toggle("is-error", Boolean(isError));
        toast.hidden = false;

        if (toastTimer) {
            window.clearTimeout(toastTimer);
        }

        toastTimer = window.setTimeout(function () {
            toast.remove();
        }, 3200);
    }

    // Preserve compatibility with the inline HTML handler:
    // onsubmit="submitContactForm(event)"
    window.submitContactForm = submitContactForm;

})();