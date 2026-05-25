document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navContainer = document.querySelector(".nav-container");
    const navbarLinks = document.querySelectorAll(".navbar a");

    if (menuToggle && navContainer) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navContainer.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isOpen);
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

    const discountBubble = document.querySelector(".discount-bubble");
    const discountResult = document.querySelector(".discount-result");
    const discountValue = document.getElementById("discount-value");
    const discountCode = document.getElementById("discount-code");

    const discountInput = document.getElementById("discountInput");
    const savedDiscountBox = document.getElementById("savedDiscountBox");
    const savedDiscountCode = document.getElementById("savedDiscountCode");

    function showSavedDiscount(discount) {
        const code = `KRISTALL-${discount}`;

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

        if (discountResult) {
            discountResult.hidden = false;
        }

        if (discountBubble) {
            discountBubble.classList.add("is-popped");
        }
    }

    const savedDiscount = localStorage.getItem("kristallDiscount");

    if (savedDiscount) {
        showSavedDiscount(savedDiscount);
    }

    if (discountBubble && discountResult && discountValue) {
        discountBubble.addEventListener("click", () => {
            let discount = localStorage.getItem("kristallDiscount");

            if (!discount) {
                discount = Math.floor(Math.random() * 16) + 5;
                localStorage.setItem("kristallDiscount", discount);
            }

            showSavedDiscount(discount);
        });
    }

    const servicePanels = document.querySelectorAll(".service-panel");

    if (servicePanels.length) {
        servicePanels.forEach((panel) => {
            panel.addEventListener("click", () => {
                servicePanels.forEach((item) => {
                    item.classList.remove("active");
                    item.setAttribute("aria-expanded", "false");
                });

                panel.classList.add("active");
                panel.setAttribute("aria-expanded", "true");
            });
        });
    }
});