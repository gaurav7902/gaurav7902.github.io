import {$, $$, reduced} from "./utils.js";

const root = document.documentElement;
const THEME_COLORS = {light: "#eef2ff", dark: "#090d1a"};

/* ---------------- theme (CSS does the styling) ---------------- */
function applyTheme(theme) {
    root.dataset.theme = theme;
    $(".theme-toggle").setAttribute("aria-pressed", String(theme === "dark"));
    $('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

export function toggleTheme() {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    try {
        localStorage.setItem("theme", next);
    } catch {}
    // cross-fade between themes where the browser supports it
    if (document.startViewTransition && !reduced)
        document.startViewTransition(() => applyTheme(next));
    else applyTheme(next);
}

/* ---------------- toast ---------------- */
let toastTimer;
export function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

/* ---------------- progress bar, mobile menu, scroll-spy, reveal ---------------- */
function initProgress() {
    const bar = $(".progress");
    const update = () => {
        const scrollable = root.scrollHeight - innerHeight;
        bar.style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;
    };
    addEventListener("scroll", update, {passive: true});
    update();
}

function initMenu() {
    const toggle = $(".menu-toggle");
    const links = $(".nav-links");
    const set = (open) => {
        links.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.querySelector("i").className = open
            ? "fas fa-xmark"
            : "fas fa-bars";
    };
    toggle.addEventListener("click", () =>
        set(!links.classList.contains("is-open")),
    );
    links.addEventListener("click", (e) => e.target.closest("a") && set(false));
}

// highlights the nav link of the section currently in view
function initScrollSpy() {
    const links = new Map(
        $$(".nav-links a").map((a) => [a.getAttribute("href").slice(1), a]),
    );
    const alias = {"group-projects": "projects"};
    const observer = new IntersectionObserver(
        (entries) =>
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((a) => a.removeAttribute("aria-current"));
                links
                    .get(alias[entry.target.id] || entry.target.id)
                    ?.setAttribute("aria-current", "true");
            }),
        {rootMargin: "-40% 0px -55% 0px"},
    );
    $$("main section[id]").forEach((section) => observer.observe(section));
}

function initReveal() {
    const items = $$(".reveal");
    const observer = new IntersectionObserver(
        (entries) =>
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }),
        {threshold: 0.1},
    );
    items.forEach((el) => observer.observe(el));
}

export function initUI() {
    applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
    $(".theme-toggle").addEventListener("click", toggleTheme);
    initProgress();
    initMenu();
    initScrollSpy();
    initReveal();
}
