import {$, $$, USER, esc, ago, reduced} from "./utils.js";

const SNAPSHOT = "data/github.json"; // refreshed by .github/workflows/sync-github.yml
const API = "https://api.github.com";
const CACHE_KEY = "gh-live-v2";
const CACHE_MS = 15 * 60 * 1000;
const SELF = new Set([USER, `${USER}.github.io`]); // profile + this site
let current;
const listeners = new Set();

// accepts both GitHub API repos and the slim shape stored in the snapshot
const normalise = (r) => ({
    name: r.name,
    language: r.language,
    fork: r.fork,
    stars: r.stargazers_count ?? r.stars ?? 0,
    pushed_at: r.pushed_at,
    url: r.html_url ?? r.url,
    topics: r.topics || [],
    description: r.description,
    homepage: r.homepage,
});

function summarise(followers, repos, extra = {}) {
    const own = repos.map(normalise).filter((r) => !r.fork);
    return {
        repos: own.length,
        followers,
        stars: own.reduce((sum, r) => sum + r.stars, 0),
        repositories: own,
        calendar: extra.calendar,
        recent: own
            .filter((r) => !SELF.has(r.name))
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 3),
    };
}

export function onGitHub(callback) {
    listeners.add(callback);
    if (current) callback(current.data, current.label);
    return () => listeners.delete(callback);
}

function publish(data, label) {
    if (!data.calendar && current?.data.calendar)
        data = {...data, calendar: current.data.calendar};
    current = {data, label};
    listeners.forEach((callback) => callback(data, label));
    render(data, label);
}

function countUp(el, to) {
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
}

let animated = false;
function render(data, label) {
    for (const key of ["repos", "followers", "stars"])
        $$(`[data-stat="${key}"]`).forEach((el) =>
            animated ? (el.textContent = data[key]) : countUp(el, data[key]),
        );
    animated = true;
    if (data.recent.length)
        $("#recent-repos").innerHTML = data.recent
            .map(
                (r) =>
                    `<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a><small>${esc(r.language || "repo")} · ${ago(r.pushed_at)}</small></li>`,
            )
            .join("");
    $("#gh-status").textContent = label;
}

async function fetchLive() {
    try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
        if (cached && Date.now() - cached.t < CACHE_MS) return cached.d;
    } catch {}
    const [user, repos] = await Promise.all([
        fetch(`${API}/users/${USER}`),
        fetch(`${API}/users/${USER}/repos?per_page=100&sort=pushed`),
    ]).then((responses) =>
        Promise.all(
            responses.map((r) => {
                if (!r.ok) throw new Error("GitHub API unavailable");
                return r.json();
            }),
        ),
    );
    const data = summarise(user.followers, repos);
    try {
        sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({t: Date.now(), d: data}),
        );
    } catch {}
    return data;
}

export async function initGitHub() {
    // 1. instant, rate-limit-free numbers from the committed snapshot
    try {
        const response = await fetch(SNAPSHOT);
        if (response.ok) {
            const snap = await response.json();
            publish(
                summarise(snap.user.followers, snap.repos, {
                    calendar: snap.calendar,
                }),
                `snapshot · ${ago(snap.generated)}`,
            );
        }
    } catch {}
    // 2. upgrade to live numbers when the API is reachable
    try {
        publish(await fetchLive(), "live");
    } catch {
        if (!animated) $("#gh-status").textContent = "offline snapshot";
    }
}
