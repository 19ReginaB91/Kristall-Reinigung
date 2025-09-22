document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navContainer = document.querySelector(".nav-container");

    menuToggle.addEventListener("click", () => {
        navContainer.classList.toggle("active");
    });
});