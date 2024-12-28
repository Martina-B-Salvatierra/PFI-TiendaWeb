// Javascript

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.getElementById("main-nav").querySelector("ul");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active"); // Activa o desactiva el menú
    });
});
