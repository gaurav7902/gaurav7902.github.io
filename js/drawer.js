import {$, $$, esc, ago, repoUrl} from "./utils.js";
import {onGitHub} from "./github.js";
import {PROJECTS, GROUP_PROJECTS} from "../data/projects.js";

const PROJECTS_BY_REPO = {};
PROJECTS.concat(GROUP_PROJECTS).forEach((project) => {
    PROJECTS_BY_REPO[project.r.toLowerCase()] = project;
});
let github;
let active;
let trigger;
let visible = [];

function projectArt(project) {
    return `<div class="project-art drawer-art" style="--c: var(--${project.c})"><span>${esc(project.k)}</span><i class="fas ${project.icon}" aria-hidden="true"></i><b>${esc(project.line)}</b></div>`;
}

function fact(label, value) {
    return value ? `<span>${esc(label)}: ${esc(value)}</span>` : "";
}

function render(project) {
    const dialog = $("#drawer");
    let content = projectArt(project);
    content +=
        '<p class="drawer-kicker">' +
        esc(project.category || project.k) +
        "</p>";
    content += '<h1 id="drawer-title">' + esc(project.t) + "</h1>";
    content += '<p class="drawer-description">' + esc(project.d) + "</p>";
    content +=
        '<div class="tags">' +
        project.tags.map((tag) => "<span>" + esc(tag) + "</span>").join("") +
        "</div>";
    const repo =
        github && github.repositories
            ? github.repositories.find(
                  (item) => item.name.toLowerCase() === project.r.toLowerCase(),
              )
            : null;
    if (repo) {
        const topics = repo.topics?.join(", ");
        const facts = [
            fact("Language", repo.language),
            fact("Stars", repo.stars),
            fact("Pushed", repo.pushed_at && ago(repo.pushed_at)),
            fact("Topics", topics),
        ].join("");
        if (facts) content += `<div class="drawer-facts">${facts}</div>`;
    }
    const liveAction = project.homepage
        ? `<a class="btn btn-primary" href="${esc(project.homepage)}" target="_blank" rel="noopener noreferrer">Live demo <i class="fas fa-arrow-up-right-from-square"></i></a>`
        : "";
    content +=
        '<div class="drawer-actions">' + liveAction + '<a class="btn" href="' +
        esc(repoUrl(project)) +
        '" target="_blank" rel="noopener noreferrer">GitHub repo <i class="fab fa-github"></i></a></div>';
    content +=
        '<div class="drawer-nav"><button type="button" data-prev aria-label="Previous project"><i class="fas fa-arrow-left"></i></button><button type="button" data-next aria-label="Next project"><i class="fas fa-arrow-right"></i></button></div>';
    dialog.querySelector(".drawer-content").innerHTML = content;
    dialog.querySelector("[data-prev]").disabled =
        visible.indexOf(project) <= 0;
    dialog.querySelector("[data-next]").disabled =
        visible.indexOf(project) >= visible.length - 1;
}

function setProject(project) {
    active = project;
    render(project);
    history.replaceState(null, "", `#project-${project.r}`);
}

export function openProject(repo) {
    const project = PROJECTS_BY_REPO[String(repo).toLowerCase()];
    const card = $(
        `[data-project="${CSS.escape(project ? project.r : repo)}"]`,
    );
    if (!project || !card) return;
    trigger = card;
    const grid = card.closest(".projects-grid");
    visible = $$(".project:not([hidden])", grid)
        .map((item) => PROJECTS_BY_REPO[item.dataset.repo.toLowerCase()])
        .filter(Boolean);
    card.scrollIntoView({behavior: "smooth", block: "center"});
    setProject(project);
    const dialog = $("#drawer");
    if (!dialog.open) dialog.showModal();
}

export function initDrawer() {
    const dialog = $("#drawer");
    if (!dialog) return;
    onGitHub((data) => {
        github = data;
        if (dialog.open && active) render(active);
    });
    dialog
        .querySelector(".drawer-close")
        .addEventListener("click", () => dialog.close());
    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-project]");
        if (button) openProject(button.dataset.project);
    });
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
        if (event.target.closest("[data-prev]") && visible.length)
            setProject(visible[visible.indexOf(active) - 1]);
        if (event.target.closest("[data-next]") && visible.length)
            setProject(visible[visible.indexOf(active) + 1]);
    });
    dialog.addEventListener("close", () => {
        history.replaceState(
            null,
            "",
            `${location.pathname}${location.search}`,
        );
        if (trigger) trigger.focus();
        trigger = null;
        active = null;
    });
    dialog.addEventListener("cancel", () => dialog.close());
    document.addEventListener("keydown", (event) => {
        if (!dialog.open) return;
        if (event.key === "Escape") {
            event.preventDefault();
            dialog.close();
            return;
        }
        if (event.key === "ArrowLeft" && visible.indexOf(active) > 0)
            setProject(visible[visible.indexOf(active) - 1]);
        if (
            event.key === "ArrowRight" &&
            visible.indexOf(active) < visible.length - 1
        )
            setProject(visible[visible.indexOf(active) + 1]);
    });
    const match = location.hash.match(/^#project-(.+)$/i);
    if (match)
        requestAnimationFrame(() =>
            setTimeout(() => openProject(decodeURIComponent(match[1])), 0),
        );
}
