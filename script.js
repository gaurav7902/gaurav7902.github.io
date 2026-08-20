document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        document.querySelectorAll(".nav-links a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }

    const toggleBtn = document.getElementById("toggle-projects-btn");
    const moreProjects = document.querySelector(".more-projects");

    if (toggleBtn && moreProjects) {
        toggleBtn.addEventListener("click", () => {
            const isHidden = moreProjects.classList.toggle("hidden");
            if (isHidden) {
                toggleBtn.textContent = "Show All Projects";
            } else {
                toggleBtn.textContent = "Show Less";
            }
        });
    }
});
