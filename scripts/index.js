document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navContainer = document.querySelector(".nav-container");
    const navbarLinks = document.querySelectorAll(".navbar a");

    if (menuToggle && navContainer) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navContainer.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navbarLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navContainer.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const hero = document.querySelector(".hero");
    const bubbles = document.querySelectorAll(".bubble");

    if (hero && bubbles.length) {
        hero.addEventListener("mousemove", (event) => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            bubbles.forEach((bubble, index) => {
                const strength = 10 + index * 5;
                bubble.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
        });

        hero.addEventListener("mouseleave", () => {
            bubbles.forEach((bubble) => {
                bubble.style.transform = "translate(0, 0)";
            });
        });
    }

    if (hero) {
        hero.addEventListener("mousemove", (event) => {
            const rect = hero.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = event.clientY - rect.top;
            const bottomDistance = rect.height - y;

            hero.style.setProperty("--foam-x", `${x}%`);

            if (bottomDistance < 230) {
                hero.classList.add("foam-active");
                hero.style.setProperty("--foam-lift", "-10px");
            } else {
                hero.classList.remove("foam-active");
                hero.style.setProperty("--foam-lift", "0px");
            }
        });

        hero.addEventListener("mouseleave", () => {
            hero.classList.remove("foam-active");
            hero.style.setProperty("--foam-x", "50%");
            hero.style.setProperty("--foam-lift", "0px");
        });
    }

    const discountBubble = document.querySelector(".discount-bubble");
    const discountResult = document.querySelector(".discount-result");
    const discountValue = document.getElementById("discount-value");
    const discountCode = document.getElementById("discount-code");

    const discountInput = document.getElementById("discountInput");
    const savedDiscountBox = document.getElementById("savedDiscountBox");
    const savedDiscountCode = document.getElementById("savedDiscountCode");

    let discountWasOpened = false;

    function getDiscountCode(discount) {
        return `KRISTALL-${discount}`;
    }

    function fillDiscountEverywhere(discount) {
        const code = getDiscountCode(discount);

        if (discountValue) {
            discountValue.textContent = discount;
        }

        if (discountCode) {
            discountCode.textContent = code;
        }

        if (discountInput) {
            discountInput.value = code;
        }

        if (savedDiscountCode) {
            savedDiscountCode.textContent = code;
        }

        if (savedDiscountBox) {
            savedDiscountBox.hidden = false;
        }
    }

    function createSplash(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 22; i++) {
            const splash = document.createElement("span");
            splash.className = "bubble-splash";

            const angle = (Math.PI * 2 * i) / 22;
            const distance = 55 + Math.random() * 70;
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;

            splash.style.left = `${centerX}px`;
            splash.style.top = `${centerY}px`;
            splash.style.setProperty("--move-x", `${moveX}px`);
            splash.style.setProperty("--move-y", `${moveY}px`);

            document.body.appendChild(splash);

            setTimeout(() => {
                splash.remove();
            }, 900);
        }
    }

    function openDiscountWindow() {
        if (discountWasOpened) {
            return;
        }

        discountWasOpened = true;

        const discount = "10";
        localStorage.setItem("kristallDiscount", discount);

        fillDiscountEverywhere(discount);

        if (discountBubble) {
            createSplash(discountBubble);
            discountBubble.classList.add("is-popped");
        }

        if (discountResult) {
            discountResult.hidden = false;

            requestAnimationFrame(() => {
                discountResult.classList.add("is-visible");
            });
        }
    }

    const savedDiscount = localStorage.getItem("kristallDiscount");

    if (savedDiscount) {
        fillDiscountEverywhere(savedDiscount);
        discountWasOpened = true;

        if (discountBubble) {
            discountBubble.classList.add("is-popped");
        }

        if (discountResult) {
            discountResult.hidden = false;
            discountResult.classList.add("is-visible");
        }
    }

    if (discountBubble) {
        discountBubble.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            openDiscountWindow();
        });

        discountBubble.addEventListener("touchstart", (event) => {
            event.preventDefault();
            event.stopPropagation();
            openDiscountWindow();
        }, { passive: false });
    }

    const servicePanels = document.querySelectorAll(".service-panel");

    if (servicePanels.length) {
        servicePanels.forEach((panel) => {
            panel.addEventListener("click", (event) => {
                if (event.target.closest("a, button, input, textarea")) {
                    return;
                }

                servicePanels.forEach((item) => {
                    item.classList.remove("active");
                    item.setAttribute("aria-expanded", "false");
                });

                panel.classList.add("active");
                panel.setAttribute("aria-expanded", "true");
            });

            panel.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    panel.click();
                }
            });
        });
    }
});