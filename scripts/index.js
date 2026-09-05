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

    const discountWheelPanel = document.getElementById("discountWheelPanel");
    const openDiscountWheel = document.getElementById("openDiscountWheel");
    const openDiscountWheelCard = document.getElementById("openDiscountWheelCard");
    const discountWheel = document.getElementById("discountWheel");
    const spinDiscountWheel = document.getElementById("spinDiscountWheel");
    const discountResult = document.getElementById("discountResultInline");
    const discountValue = document.getElementById("discount-value");
    const discountCode = document.getElementById("discount-code");

    const discountInput = document.getElementById("discountInput");
    const savedDiscountBox = document.getElementById("savedDiscountBox");
    const savedDiscountCode = document.getElementById("savedDiscountCode");

    const discountStorageKey = "kristallWheelDiscount";
    localStorage.removeItem("kristallDiscount");
    let discountWasOpened = false;
    let wheelWasSpun = false;
    let savedBadgeTimer = null;

    function getDiscountCode(discount) {
        return `KRISTALL-${discount}`;
    }

    function getRandomDiscount() {
        const discounts = [5, 10, 15, 20, 10, 15];
        const randomIndex = Math.floor(Math.random() * discounts.length);

        return {
            value: String(discounts[randomIndex]),
            index: randomIndex,
            rotation: getWheelRotation(randomIndex)
        };
    }

    function getWheelRotation(index) {
        const segmentAngle = 60;

        return 360 * 5 + (360 - index * segmentAngle);
    }

    function saveDiscount(discount) {
        const savedDiscount = {
            value: discount.value,
            code: getDiscountCode(discount.value),
            index: discount.index,
            rotation: discount.rotation
        };

        localStorage.setItem(discountStorageKey, JSON.stringify(savedDiscount));

        return savedDiscount;
    }

    function readSavedDiscount() {
        const savedDiscount = localStorage.getItem(discountStorageKey);

        if (!savedDiscount) return null;

        try {
            const parsedDiscount = JSON.parse(savedDiscount);

            if (parsedDiscount && parsedDiscount.value) {
                return {
                    value: String(parsedDiscount.value),
                    code: parsedDiscount.code || getDiscountCode(parsedDiscount.value),
                    index: Number.isInteger(parsedDiscount.index) ? parsedDiscount.index : 0,
                    rotation: Number.isFinite(parsedDiscount.rotation)
                        ? parsedDiscount.rotation
                        : getWheelRotation(Number.isInteger(parsedDiscount.index) ? parsedDiscount.index : 0)
                };
            }
        } catch (error) {
            return {
                value: savedDiscount,
                code: getDiscountCode(savedDiscount),
                index: 0,
                rotation: getWheelRotation(0)
            };
        }

        return null;
    }

    function createSavedDiscountBadge(code) {
        let badge = document.querySelector(".discount-saved-badge");

        if (!badge) {
            badge = document.createElement("div");
            badge.className = "discount-saved-badge";
            document.body.appendChild(badge);
        }

        badge.innerHTML = `
            <strong>Rabatt gespeichert: ${code}</strong>
            <span>Der Kristall-Vorteil wird bei Ihrer Anfrage automatisch mitgesendet.</span>
        `;

        badge.hidden = false;

        requestAnimationFrame(() => {
            badge.classList.add("is-visible");
        });

        if (savedBadgeTimer) {
            clearTimeout(savedBadgeTimer);
        }

        savedBadgeTimer = setTimeout(() => {
            badge.classList.remove("is-visible");

            setTimeout(() => {
                badge.hidden = true;
            }, 300);
        }, 5000);
    }

    function fillDiscountEverywhere(discount) {
        const code = getDiscountCode(discount);

        if (discountValue) discountValue.textContent = discount;
        if (discountCode) discountCode.textContent = code;
        if (discountInput) discountInput.value = code;
        if (savedDiscountCode) savedDiscountCode.textContent = code;
        if (savedDiscountBox) savedDiscountBox.hidden = false;

        return code;
    }

    function openDiscountWindow() {
        if (discountWasOpened) return;

        discountWasOpened = true;

        if (discountWheelPanel) {
            discountWheelPanel.hidden = false;

            requestAnimationFrame(() => {
                discountWheelPanel.classList.add("is-open");
            });
        }

        [openDiscountWheel, openDiscountWheelCard].forEach((button) => {
            if (!button) return;
            button.setAttribute("aria-expanded", "true");
        });

        if (openDiscountWheel) {
            openDiscountWheel.textContent = "Vorteil geöffnet";
        }

        if (discountWheelPanel) {
            discountWheelPanel.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function spinWheel() {
        if (wheelWasSpun) return;

        wheelWasSpun = true;

        const discount = saveDiscount(getRandomDiscount());
        fillDiscountEverywhere(discount.value);

        if (discountWheel) {
            discountWheel.style.transform = `rotate(${discount.rotation}deg)`;
        }

        if (spinDiscountWheel) {
            spinDiscountWheel.disabled = true;
            spinDiscountWheel.textContent = "Vorteil gespeichert";
        }

        setTimeout(() => {
            if (discountResult) discountResult.hidden = false;
            createSavedDiscountBadge(discount.code);
        }, 3200);
    }

    const savedDiscount = readSavedDiscount();

    if (savedDiscount) {
        fillDiscountEverywhere(savedDiscount.value);
        discountWasOpened = true;
        wheelWasSpun = true;

        if (discountWheelPanel) {
            discountWheelPanel.hidden = false;
            discountWheelPanel.classList.add("is-open");
        }

        [openDiscountWheel, openDiscountWheelCard].forEach((button) => {
            if (!button) return;
            button.setAttribute("aria-expanded", "true");
        });

        if (openDiscountWheel) {
            openDiscountWheel.textContent = "Vorteil gespeichert";
        }

        if (spinDiscountWheel) {
            spinDiscountWheel.disabled = true;
            spinDiscountWheel.textContent = "Vorteil gespeichert";
        }

        if (discountWheel) {
            discountWheel.style.transform = `rotate(${savedDiscount.rotation}deg)`;
        }

        if (discountResult) discountResult.hidden = false;
        createSavedDiscountBadge(savedDiscount.code);
    }

    if (openDiscountWheel) {
        openDiscountWheel.addEventListener("click", openDiscountWindow);
    }

    if (openDiscountWheelCard) {
        openDiscountWheelCard.addEventListener("click", openDiscountWindow);
    }

    if (spinDiscountWheel) {
        spinDiscountWheel.addEventListener("click", spinWheel);
    }

    const servicePanels = document.querySelectorAll(".service-panel");

    if (servicePanels.length) {
        servicePanels.forEach((panel) => {
            panel.addEventListener("click", (event) => {
                if (event.target.closest("a, button, input, textarea")) return;

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

    // --- Интеграция формы (добавлено в самом конце, не меняя остальной код) ---
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            console.log("Formular wird an Netlify gesendet");
        });
    }
});
