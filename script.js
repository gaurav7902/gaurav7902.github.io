(() => {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [
        ...root.querySelectorAll(selector),
    ];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia(
        "(hover: hover) and (pointer: fine)",
    ).matches;
    const USER = "gaurav7902";
    const EMAIL = "patidargaurav7902@gmail.com";
    const esc = (value) =>
        String(value).replace(
            /[&<>"]/g,
            (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c],
        );

    /* ---------------- data ---------------- */
    const PROJECTS = [
        {
            t: "BuyNest E-Commerce",
            r: "BuyNest-Ecom-Website",
            category: "Full Stack Apps",
            k: "01 / Commerce",
            line: "Built for busy people.",
            icon: "fa-bag-shopping",
            c: "orange",
            d: "A MERN-stack secure ecommerce website with authentication, product discovery, cart, and checkout.",
            tags: ["React", "Node.js", "MongoDB"],
        },
        {
            t: "Learning Management System",
            r: "learning-management-sys",
            category: "Full Stack Apps",
            k: "02 / Learning",
            line: "Learn more. Build better.",
            icon: "fa-graduation-cap",
            c: "pink",
            d: "A full-stack LMS for course creation, media delivery, enrollment, and PayPal Sandbox payments.",
            tags: ["JavaScript", "Node.js", "PayPal API"],
        },
        {
            t: "Graph Visualizer",
            r: "graph-visualizer",
            category: "Full Stack Apps",
            k: "03 / Systems",
            line: "Make the invisible visible.",
            icon: "fa-diagram-project",
            c: "blue",
            d: "A visual learning platform for building graphs and watching algorithms and data structures unfold.",
            tags: ["JavaScript", "Algorithms"],
        },
        {
            t: "OneDrive Downloader",
            r: "onedrive-dl",
            owner: "sharepoint-dl",
            category: "Tools",
            k: "04 / Productivity",
            line: "Small tools. Less friction.",
            icon: "fa-cloud-arrow-down",
            c: "lime",
            d: "CLI utility to download files and directory structures directly from OneDrive links.",
            tags: ["Python", "CLI"],
        },
        {
            t: "Codeforces Dark Theme",
            r: "codeforces-darktheme",
            category: "Browser Extensions",
            k: "05 / Competitive coding",
            line: "Focus on the problem.",
            icon: "fa-code",
            c: "yellow",
            d: "A modern dark theme stylesheet for competitive programmers on Codeforces.",
            tags: ["CSS3", "UserStyles"],
        },
        {
            t: "JobSense",
            r: "jobsense",
            category: "AI and Data",
            k: "06 / AI systems",
            line: "Find the signal.",
            icon: "fa-magnifying-glass-chart",
            c: "purple",
            d: "A local, conversational job finder that retrieves listings and generates preference-aware answers.",
            tags: ["Python", "AI"],
        },
        {
            t: "Gmail Shortcuts Plus",
            r: "gmail-shortcuts-plus",
            category: "Browser Extensions",
            k: "07 / Browser tools",
            line: "Navigate mail faster.",
            icon: "fa-envelope",
            c: "yellow",
            d: "A lightweight Chrome extension that adds arrow-key navigation to Gmail.",
            tags: ["JavaScript", "Chrome"],
        },
        {
            t: "GNOME Widgets",
            r: "gnome-widgets",
            category: "Gnome Extensions",
            k: "08 / Desktop tools",
            line: "Useful at a glance.",
            icon: "fa-window-maximize",
            c: "orange",
            d: "A collection of widgets for extending GNOME Shell with useful desktop information.",
            tags: ["TypeScript", "GNOME"],
        },
        {
            t: "Hangman",
            r: "Hangman-Word-Guess",
            category: "Games",
            k: "09 / Games",
            line: "Guess with intention.",
            icon: "fa-puzzle-piece",
            c: "pink",
            d: "A browser-based hangman word guessing game built for quick play.",
            tags: ["TypeScript", "Game"],
        },
        {
            t: "Local LLM",
            r: "local-llm",
            category: "AI and Data",
            k: "10 / Local AI",
            line: "Private by design.",
            icon: "fa-laptop-code",
            c: "lime",
            d: "Running a local language model on any PC.",
            tags: ["Python", "LLM"],
        },
        {
            t: "Adskip Elite",
            r: "Adskip-Elite",
            category: "Browser Extensions",
            k: "11 / Browser tools",
            line: "Skip the interruption.",
            icon: "fa-forward",
            c: "blue",
            d: "A JavaScript userscript that automatically presses YouTube's skip-ad button.",
            tags: ["JavaScript", "Automation"],
        },
        {
            t: "QualityTube",
            r: "QualityTube",
            category: "Browser Extensions",
            k: "12 / Video",
            line: "Always choose the quality.",
            icon: "fa-video",
            c: "yellow",
            d: "A browser extension that keeps YouTube videos at their highest available quality.",
            tags: ["JavaScript", "YouTube", "Browser"],
            homepage: "https://thegorav.xyz/QualityTube/",
        },
        {
            t: "Safest Volume Booster",
            r: "safest-volume-booster",
            category: "Browser Extensions",
            k: "13 / Audio",
            line: "Safer sound controls.",
            icon: "fa-volume-high",
            c: "pink",
            d: "A browser extension experiment for boosting and controlling browser audio volume.",
            tags: ["JavaScript", "Audio", "Browser"],
        },
        {
            t: "Portable Local LLM",
            r: "portable-local-llm",
            category: "AI and Data",
            k: "14 / Local AI",
            line: "AI that travels.",
            icon: "fa-box",
            c: "lime",
            d: "A portable setup for running local language models on a personal machine.",
            tags: ["Shell", "LLM", "Local AI"],
        },
        {
            t: "Weather App",
            r: "weather-app",
            category: "Full Stack Apps",
            k: "15 / Weather",
            line: "Forecast at a glance.",
            icon: "fa-cloud-sun",
            c: "blue",
            d: "A JavaScript weather application for checking forecasts and location conditions.",
            tags: ["JavaScript", "Weather", "API"],
        },
        {
            t: "To-Do",
            r: "To-Do",
            category: "Full Stack Apps",
            k: "16 / Productivity",
            line: "Make work manageable.",
            icon: "fa-list-check",
            c: "orange",
            d: "A TypeScript to-do application for organizing tasks and daily work.",
            tags: ["TypeScript", "Tasks", "Web"],
            homepage: "https://thegorav.xyz/To-Do/",
        },
        {
            t: "NETACCESS Automator",
            r: "netaccess-automate-iitism",
            category: "Tools",
            k: "17 / Campus",
            line: "Less repetitive setup.",
            icon: "fa-wifi",
            c: "purple",
            d: "A Python automation tool for IIT ISM NETACCESS login workflows.",
            tags: ["Python", "Automation", "Networking"],
        },
        {
            t: "ToDo Terminal",
            r: "ToDo-List",
            category: "Tools",
            k: "18 / CLI",
            line: "Tasks from the terminal.",
            icon: "fa-terminal",
            c: "yellow",
            d: "A terminal-based C++ implementation of a to-do list.",
            tags: ["C++", "CLI", "Tasks"],
        },
        {
            t: "The Movies Hub",
            r: "The-Movies-Hub",
            category: "Full Stack Apps",
            k: "19 / Entertainment",
            line: "Discover what to watch.",
            icon: "fa-film",
            c: "purple",
            d: "A React and Vite movie discovery app for exploring popular films and saving favorites.",
            tags: ["JavaScript", "Web"],
        },
        {
            t: "Gemini CLI Chat",
            r: "Gemini-Cli-Chat",
            category: "AI and Data",
            k: "20 / Tools",
            line: "Chat from the terminal.",
            icon: "fa-terminal",
            c: "blue",
            d: "A command-line chat interface for interacting with Google's Gemini models.",
            tags: ["Python", "CLI", "Gemini"],
        },
        {
            t: "Obsidian Graph in VS Code",
            r: "obsidian-graph-in-vscode",
            category: "VSCode Extensions",
            k: "21 / Editor tools",
            line: "Notes, connected.",
            icon: "fa-share-nodes",
            c: "pink",
            d: "A VS Code extension that brings Obsidian-style graph navigation to Markdown notes.",
            tags: ["TypeScript", "VS Code"],
        },
        {
            t: "My Neovim Configuration",
            r: "my-neovim-configuration",
            category: "Tools",
            k: "22 / Workstation",
            line: "A faster editing workflow.",
            icon: "fa-keyboard",
            c: "lime",
            d: "A reproducible Neovim configuration focused on a fast, keyboard-driven workflow.",
            tags: ["Lua", "Neovim"],
        },
        {
            t: "Compiler Design",
            r: "Compiler-Design",
            category: "Tools",
            k: "23 / Compilers",
            line: "Understand the pipeline.",
            icon: "fa-code-branch",
            c: "yellow",
            d: "Compiler design implementations and practical coursework for language processing.",
            tags: ["C", "Compiler"],
        },
        {
            t: "Computer Networks Notes",
            r: "Computer-Networks-Notes",
            category: "Notes",
            k: "24 / Networks",
            line: "Protocols made clear.",
            icon: "fa-network-wired",
            c: "blue",
            d: "Structured study notes covering computer networking concepts and protocols.",
            tags: ["Notes", "Networking"],
        },
        {
            t: "Digital Image Processing",
            r: "Digital-Image-Processing",
            category: "Notes",
            k: "25 / Imaging",
            line: "Pixels to insight.",
            icon: "fa-image",
            c: "pink",
            d: "Notes and practical work exploring digital image processing techniques.",
            tags: ["Notes", "Image processing"],
        },
        {
            t: "Library Management System",
            r: "LIbrary-Management-System",
            category: "Tools",
            k: "26 / Education",
            line: "Organize every volume.",
            icon: "fa-book",
            c: "orange",
            d: "A library management application for cataloging and tracking books and users.",
            tags: ["Java", "Web"],
        },
    ];

    const GROUP_PROJECTS = [
        {
            t: "Medical Copilot",
            r: "medical-copilot-system",
            k: "01 / Healthcare",
            line: "AI-assisted care.",
            icon: "fa-heart-pulse",
            c: "purple",
            d: "An AI-based medical management software project.",
            tags: ["AI", "Healthcare", "Streamlit"],
            homepage: "https://frontend-zxra8c5w4ip3f6k5gvjasp.streamlit.app/",
        },
        {
            t: "PET Perplexity",
            r: "pet-perplexity-agglomeration-v1",
            k: "02 / AI systems",
            line: "Explore PET concepts.",
            icon: "fa-brain",
            c: "blue",
            d: "A JavaScript project exploring PET perplexity and agglomeration concepts.",
            tags: ["JavaScript", "AI", "Research"],
        },
        {
            t: "Software Component Catalogue",
            r: "software-component-catalogue",
            k: "03 / Cataloguing",
            line: "Components, connected.",
            icon: "fa-cubes",
            c: "orange",
            d: "A catalogue for discovering and organising reusable software components.",
            tags: ["Catalogue", "Web", "Components"],
            homepage: "https://componenthub-frontend.onrender.com",
        },
        {
            t: "Operating Systems",
            r: "Operating-Systems-Project",
            k: "04 / Systems",
            line: "Extend the kernel.",
            icon: "fa-gears",
            c: "lime",
            d: "A fork of MIT xv6 with custom system calls and operating systems experiments.",
            tags: ["C", "xv6", "Operating systems"],
        },
    ];

    // Source of truth: contributions.md
    const CONTRIBUTIONS = {
        "Features / Fixes": [
            "https://github.com/Soham109/cpos/pull/5",
            "https://github.com/NeptuneHub/AudioMuse-AI/pull/737",
            "https://github.com/Tudmotu/gnome-shell-extension-clipboard-indicator/pull/628",
        ],
        "CI/CD": ["https://github.com/BaaRai/ARTEX/pull/516"],
        "Version Updates": ["https://github.com/nozwock/packet/pull/133"],
        Translations: [
            "https://github.com/github/opensource.guide/pull/3682",
            "https://github.com/subhra74/xdm/pull/1382",
        ],
        Documentation: [
            "https://github.com/super-productivity/super-productivity/pull/7833",
            "https://github.com/bilawalsidhu/gods-eye-view/pull/210",
            "https://github.com/alirezarezvani/claude-skills/pull/889",
            "https://github.com/bobbyiliev/101-linux-commands/pull/5",
        ],
        "Discussion Mentions": [
            "https://github.com/super-productivity/super-productivity/discussions/7908",
        ],
        Issues: ["https://github.com/NeptuneHub/AudioMuse-AI/issues/736"],
    };
    const CATEGORY_COLOR = {
        "Features / Fixes": "orange",
        "CI/CD": "blue",
        "Version Updates": "yellow",
        Translations: "pink",
        Documentation: "lime",
        "Discussion Mentions": "purple",
        Issues: "orange",
    };
    const KIND = {pull: "PR", discussions: "Discussion", issues: "Issue"};

    /* ---------------- theme (CSS does the styling) ---------------- */
    const root = document.documentElement;
    const themeButton = $(".theme-toggle");
    const syncTheme = () =>
        themeButton.setAttribute(
            "aria-pressed",
            String(root.dataset.theme === "dark"),
        );
    const toggleTheme = () => {
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try {
            localStorage.setItem("theme", next);
        } catch {}
        syncTheme();
    };
    syncTheme();
    themeButton.addEventListener("click", toggleTheme);

    /* ---------------- progress + mobile nav ---------------- */
    const progress = $(".progress");
    const updateProgress = () => {
        const scrollable = root.scrollHeight - innerHeight;
        progress.style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;
    };
    addEventListener("scroll", updateProgress, {passive: true});
    updateProgress();

    const menuToggle = $(".menu-toggle");
    const navLinks = $(".nav-links");
    const setMenu = (open) => {
        navLinks.classList.toggle("is-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.querySelector("i").className = open
            ? "fas fa-xmark"
            : "fas fa-bars";
    };
    menuToggle.addEventListener("click", () =>
        setMenu(!navLinks.classList.contains("is-open")),
    );
    navLinks.addEventListener(
        "click",
        (e) => e.target.closest("a") && setMenu(false),
    );

    /* ---------------- render projects + contributions ---------------- */
    const projectGrid = $("#projects-grid");
    projectGrid.innerHTML = PROJECTS.map(
        (
            p,
        ) => `<article class="card project fx" data-tilt data-category="${esc(p.category)}" data-tags="${esc(p.tags.join("|"))}">
            <div class="project-art" style="--c: var(--${p.c})">
                <span>${esc(p.k)}</span><i class="fas ${p.icon}" aria-hidden="true"></i><b>${esc(p.line)}</b>
            </div>
            <div class="project-body">
                <div class="row"><h3>${esc(p.t)}</h3>
                    <a href="https://github.com/${p.owner || USER}/${p.r}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.t)} repository"><i class="fab fa-github"></i></a>
                </div>
                <p>${esc(p.d)}</p>
                <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
            </div>
        </article>`,
    ).join("");

    const groupGrid = $("#group-projects-grid");
    groupGrid.innerHTML = GROUP_PROJECTS.map(
        (p) => `<article class="card project fx" data-tilt>
            <div class="project-art" style="--c: var(--${p.c})">
                <span>${esc(p.k)}</span><i class="fas ${p.icon}" aria-hidden="true"></i><b>${esc(p.line)}</b>
            </div>
            <div class="project-body">
                <div class="row"><h3>${esc(p.t)}</h3>
                    <a href="https://github.com/${USER}/${p.r}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.t)} repository"><i class="fab fa-github"></i></a>
                </div>
                <p>${esc(p.d)}</p>
                <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
            </div>
        </article>`,
    ).join("");

    const contributions = Object.entries(CONTRIBUTIONS).flatMap(([cat, urls]) =>
        urls.map((url) => {
            const [owner, repo, type, number] = new URL(url).pathname
                .split("/")
                .filter(Boolean);
            return {
                cat,
                owner,
                repo,
                url,
                label: `${KIND[type] || "Link"} #${number}`,
            };
        }),
    );
    $("#contrib-count").textContent = contributions.length;
    $("#contrib-grid").innerHTML = contributions
        .map(
            (
                c,
            ) => `<a class="card contrib fx" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer" data-cat="${esc(c.cat)}">
                <span><strong>${esc(c.repo)}</strong><small>${esc(c.owner)} · ${esc(c.label)}</small></span>
                <em class="badge" style="--c: var(--${CATEGORY_COLOR[c.cat]})">${esc(c.cat)}</em>
            </a>`,
        )
        .join("");

    /* ---------------- filter chips ---------------- */
    function setupFilter(box, cards, keysOf, onCount, sortByCount = false, firstKey = "") {
        const keys = [...new Set(cards.flatMap(keysOf))];
        if (sortByCount) {
            const first = firstKey ? keys.find((key) => key === firstKey) : undefined;
            const ordered = first ? keys.filter((key) => key !== first) : [...keys];
            ordered.sort((a, b) => {
                const countA = cards.filter((c) => keysOf(c).includes(a)).length;
                const countB = cards.filter((c) => keysOf(c).includes(b)).length;
                return countB - countA || a.localeCompare(b);
            });
            keys.splice(0, keys.length, ...(first ? [first, ...ordered] : ordered));
        }
        const chip = (key, label, n) =>
            `<button class="chip" type="button" data-k="${esc(key)}" aria-pressed="${key === ""}">${esc(label)} <b>${n}</b></button>`;
        box.innerHTML =
            keys
                .map((k) =>
                    chip(
                        k,
                        k,
                        cards.filter((c) => keysOf(c).includes(k)).length,
                    ),
                )
                .join("") +
            chip("", "All", cards.length);
        const apply = (key) => {
            let shown = 0;
            cards.forEach((card) => {
                const match = !key || keysOf(card).includes(key);
                card.hidden = !match;
                if (match) {
                    shown++;
                    card.classList.remove("pop");
                    void card.offsetWidth;
                    card.classList.add("pop");
                }
            });
            onCount && onCount(shown, cards.length);
        };
        box.addEventListener("click", (e) => {
            const button = e.target.closest(".chip");
            if (!button) return;
            $$(".chip", box).forEach((b) =>
                b.setAttribute("aria-pressed", String(b === button)),
            );
            apply(button.dataset.k);
        });
        apply("");
    }
    setupFilter(
        $("#project-filters"),
        $$(".project", projectGrid),
        (card) => [card.dataset.category],
        (n, total) =>
            ($("#project-count").textContent =
                `Showing ${n} of ${total} projects`),
        true,
        "Full Stack Apps",
    );
    setupFilter(
        $("#contrib-filters"),
        $$(".contrib", $("#contrib-grid")),
        (card) => [card.dataset.cat],
    );

    /* ---------------- reveal on scroll ---------------- */
    const revealables = $$(".reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                }),
            {threshold: 0.1},
        );
        revealables.forEach((el) => observer.observe(el));
    } else {
        revealables.forEach((el) => el.classList.add("is-visible"));
    }

    /* ---------------- typewriter hero ---------------- */
    const typed = $("#typed");
    if (typed && !reduced) {
        const roles = [
            "full-stack developer",
            "open source contributor",
            "IIT ISM CSE student",
            "builder of small tools",
        ];
        let role = 0;
        let chars = roles[0].length;
        let deleting = true;
        const tick = () => {
            const word = roles[role];
            chars += deleting ? -1 : 1;
            typed.textContent = word.slice(0, chars) || "\u00a0";
            let delay = deleting ? 35 : 70;
            if (!deleting && chars === word.length) {
                deleting = true;
                delay = 1500;
            } else if (deleting && chars === 0) {
                deleting = false;
                role = (role + 1) % roles.length;
                delay = 300;
            }
            setTimeout(tick, delay);
        };
        setTimeout(tick, 1800);
    }

    /* ---------------- cursor glow ---------------- */
    if (finePointer && !reduced) {
        const glow = $(".cursor-glow");
        let x = 0;
        let y = 0;
        let targetX = 0;
        let targetY = 0;
        let started = false;
        addEventListener(
            "pointermove",
            (e) => {
                if (e.pointerType !== "mouse") return;
                targetX = e.clientX;
                targetY = e.clientY;
                if (!started) {
                    started = true;
                    x = targetX;
                    y = targetY;
                    glow.classList.add("on");
                }
                glow.classList.toggle(
                    "hot",
                    !!e.target.closest?.("a, button, .fx"),
                );
            },
            {passive: true},
        );
        root.addEventListener("mouseleave", () => glow.classList.remove("on"));
        root.addEventListener(
            "mouseenter",
            () => started && glow.classList.add("on"),
        );
        const loop = () => {
            x += (targetX - x) * 0.14;
            y += (targetY - y) * 0.14;
            glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            requestAnimationFrame(loop);
        };
        loop();
    }

    /* ---------------- spotlight + 3D tilt ---------------- */
    document.addEventListener(
        "pointermove",
        (e) => {
            if (e.pointerType !== "mouse") return;
            const card = e.target.closest?.(".fx");
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;
            card.style.setProperty("--mx", `${px}px`);
            card.style.setProperty("--my", `${py}px`);
            if (!reduced && "tilt" in card.dataset) {
                const rx = ((0.5 - py / rect.height) * 7).toFixed(2);
                const ry = ((px / rect.width - 0.5) * 7).toFixed(2);
                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translate(-3px, -3px)`;
            }
        },
        {passive: true},
    );
    document.addEventListener("pointerout", (e) => {
        const card = e.target.closest?.(".fx");
        if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });

    /* ---------------- toast ---------------- */
    const toastEl = $("#toast");
    let toastTimer;
    const toast = (message) => {
        toastEl.textContent = message;
        toastEl.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
    };
    const copyEmail = () =>
        (navigator.clipboard
            ? navigator.clipboard.writeText(EMAIL)
            : Promise.reject()
        ).then(
            () => toast("Email copied"),
            () => toast(EMAIL),
        );

    /* ---------------- live GitHub stats ---------------- */
    const ago = (iso) => {
        const seconds = (Date.now() - new Date(iso)) / 1000;
        const units = [
            [31536000, "y"],
            [2592000, "mo"],
            [86400, "d"],
            [3600, "h"],
            [60, "m"],
        ];
        for (const [size, label] of units)
            if (seconds >= size)
                return `${Math.floor(seconds / size)}${label} ago`;
        return "just now";
    };
    const countUp = (el, to) => {
        if (reduced || !Number.isFinite(to)) {
            el.textContent = to;
            return;
        }
        const start = performance.now();
        const step = (now) => {
            const t = Math.min((now - start) / 800, 1);
            el.textContent = Math.round(to * (1 - (1 - t) ** 3));
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const readCache = () => {
        try {
            const cached = JSON.parse(sessionStorage.getItem("gh-stats-v1"));
            return cached && Date.now() - cached.t < 15 * 60 * 1000
                ? cached.d
                : null;
        } catch {
            return null;
        }
    };
    const writeCache = (d) => {
        try {
            sessionStorage.setItem(
                "gh-stats-v1",
                JSON.stringify({t: Date.now(), d}),
            );
        } catch {}
    };
    async function loadStats() {
        const status = $("#gh-status");
        try {
            let data = readCache();
            if (!data) {
                const [userRes, repoRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${USER}`),
                    fetch(
                        `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`,
                    ),
                ]);
                if (!userRes.ok || !repoRes.ok)
                    throw new Error("GitHub API unavailable");
                const [user, repos] = await Promise.all([
                    userRes.json(),
                    repoRes.json(),
                ]);
                data = {
                    repos: user.public_repos,
                    followers: user.followers,
                    stars: repos.reduce(
                        (sum, r) => sum + r.stargazers_count,
                        0,
                    ),
                    recent: repos
                        .filter((r) => !r.fork)
                        .slice(0, 3)
                        .map((r) => ({
                            name: r.name,
                            lang: r.language,
                            at: r.pushed_at,
                            url: r.html_url,
                        })),
                };
                writeCache(data);
            }
            ["repos", "followers", "stars"].forEach((key) =>
                countUp($(`[data-stat="${key}"]`), data[key]),
            );
            if (data.recent.length)
                $("#recent-repos").innerHTML = data.recent
                    .map(
                        (r) =>
                            `<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a><small>${esc(r.lang || "repo")} · ${ago(r.at)}</small></li>`,
                    )
                    .join("");
            status.textContent = "live";
        } catch {
            status.textContent = "offline snapshot";
        }
    }
    loadStats();

    /* ---------------- command palette (Ctrl/Cmd + K) ---------------- */
    const dialog = $("#palette");
    const input = $("#palette-input");
    const list = $("#palette-list");
    if (/Mac|iPhone|iPad/.test(navigator.platform))
        $(".kbd-key").textContent = "⌘";

    const goTo = (id) => () =>
        $(id).scrollIntoView({behavior: reduced ? "auto" : "smooth"});
    const openUrl = (url) => () => window.open(url, "_blank", "noopener");
    const commands = [
        {l: "Go to About", g: "Navigate", i: "fas fa-user", f: goTo("#about")},
        {
            l: "Go to Projects",
            g: "Navigate",
            i: "fas fa-folder-open",
            f: goTo("#projects"),
        },
        {
            l: "Go to Open source",
            g: "Navigate",
            i: "fas fa-code-pull-request",
            f: goTo("#contributions"),
        },
        {
            l: "Go to Skills",
            g: "Navigate",
            i: "fas fa-toolbox",
            f: goTo("#skills"),
        },
        {
            l: "Go to Experience",
            g: "Navigate",
            i: "fas fa-route",
            f: goTo("#experience"),
        },
        {
            l: "Go to Contact",
            g: "Navigate",
            i: "fas fa-envelope",
            f: goTo("#contact"),
        },
        {
            l: "Toggle dark / light theme",
            g: "Action",
            i: "fas fa-circle-half-stroke",
            f: toggleTheme,
        },
        {
            l: "Download resume",
            g: "Action",
            i: "fas fa-file-arrow-down",
            f: openUrl("resume.pdf"),
        },
        {l: "Copy email address", g: "Action", i: "fas fa-copy", f: copyEmail},
        {
            l: "GitHub",
            g: "Link",
            i: "fab fa-github",
            f: openUrl(`https://github.com/${USER}`),
        },
        {
            l: "LinkedIn",
            g: "Link",
            i: "fab fa-linkedin",
            f: openUrl("https://www.linkedin.com/in/gauravpatidar"),
        },
        {
            l: "X / Twitter",
            g: "Link",
            i: "fab fa-x-twitter",
            f: openUrl("https://x.com/ggoravv"),
        },
        {
            l: "YouTube",
            g: "Link",
            i: "fab fa-youtube",
            f: openUrl("https://youtube.com/@go7av"),
        },
        {
            l: "Instagram",
            g: "Link",
            i: "fab fa-instagram",
            f: openUrl("https://instagram.com/go7av"),
        },
        ...PROJECTS.map((p) => ({
            l: `Open project: ${p.t}`,
            g: "Project",
            i: "fas fa-arrow-up-right-from-square",
            f: openUrl(`https://github.com/${USER}/${p.r}`),
        })),
    ];

    let shown = [];
    let selected = 0;
    // subsequence match; substring matches rank higher
    const score = (query, text) => {
        if (!query) return 1;
        const q = query.toLowerCase();
        const t = text.toLowerCase();
        let i = 0;
        for (const ch of t) if (ch === q[i]) i++;
        if (i < q.length) return 0;
        return t.includes(q) ? 2 : 1;
    };
    const select = (index) => {
        if (!shown.length) return;
        selected = (index + shown.length) % shown.length;
        $$("li", list).forEach((li, n) =>
            li.setAttribute("aria-selected", String(n === selected)),
        );
        const current = $(`#cmd-${selected}`);
        current.scrollIntoView({block: "nearest"});
        input.setAttribute("aria-activedescendant", current.id);
    };
    const draw = () => {
        const query = input.value.trim();
        shown = commands
            .map((c) => [score(query, `${c.l} ${c.g}`), c])
            .filter(([s]) => s)
            .sort((a, b) => b[0] - a[0])
            .map(([, c]) => c);
        list.innerHTML = shown.length
            ? shown
                  .map(
                      (c, n) =>
                          `<li role="option" id="cmd-${n}" data-i="${n}" aria-selected="false"><i class="${c.i}" aria-hidden="true"></i><span>${esc(c.l)}</span><small>${c.g}</small></li>`,
                  )
                  .join("")
            : '<li class="empty">No matching command</li>';
        select(0);
    };
    const run = (index) => {
        const command = shown[index];
        if (!command) return;
        dialog.close();
        command.f();
    };
    const openPalette = () => {
        if (dialog.open) return;
        input.value = "";
        draw();
        dialog.showModal();
        input.focus();
    };
    input.addEventListener("input", draw);
    input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") (e.preventDefault(), select(selected + 1));
        else if (e.key === "ArrowUp")
            (e.preventDefault(), select(selected - 1));
        else if (e.key === "Enter") (e.preventDefault(), run(selected));
    });
    list.addEventListener("click", (e) => {
        const item = e.target.closest("li[data-i]");
        if (item) run(Number(item.dataset.i));
    });
    list.addEventListener("pointermove", (e) => {
        const item = e.target.closest("li[data-i]");
        if (item && Number(item.dataset.i) !== selected)
            select(Number(item.dataset.i));
    });
    dialog.addEventListener(
        "click",
        (e) => e.target === dialog && dialog.close(),
    );
    $$("[data-open-palette]").forEach((b) =>
        b.addEventListener("click", openPalette),
    );
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            dialog.open ? dialog.close() : openPalette();
        } else if (
            e.key === "/" &&
            !dialog.open &&
            !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)
        ) {
            e.preventDefault();
            openPalette();
        }
    });
})();
