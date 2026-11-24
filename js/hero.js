import {$, $$, esc, ago} from "./utils.js";
import {onGitHub} from "./github.js";

const TIME_ZONE = "Asia/Kolkata";

function renderRepo(data) {
    const tile = $("#now-building");
    const repo = data.recent?.[0];
    if (!tile || !repo) return;
    tile.innerHTML = `<span class="section-label">Now building</span><strong>${esc(repo.name)}</strong><small>${esc(repo.language || "Repository")} · ${esc(ago(repo.pushed_at))}</small><a class="quiet-link" href="${esc(repo.url)}" target="_blank" rel="noopener noreferrer">Open repository <i class="fas fa-arrow-up-right-from-square"></i></a>`;
}

function renderStack() {
    const target = $("#hero-stack .hero-chips");
    if (!target) return;
    const skills = [
        ...new Set(
            $$("#skills .skill li").map((item) => item.textContent.trim()),
        ),
    ];
    target.innerHTML = skills
        .slice(0, 9)
        .map((skill) => `<span>${esc(skill)}</span>`)
        .join("");
}

function renderTime() {
    const target = $("#local-time strong");
    if (!target) return;
    target.textContent = new Intl.DateTimeFormat("en-IN", {
        timeZone: TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(new Date());
}

export function initHero() {
    renderStack();
    onGitHub(renderRepo);
    renderTime();
    let timer;
    const start = () => {
        clearInterval(timer);
        if (!document.hidden) timer = setInterval(renderTime, 1000);
    };
    document.addEventListener("visibilitychange", start);
    start();
}
