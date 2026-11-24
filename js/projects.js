import {$, $$, esc, repoUrl} from "./utils.js";
import {setupFilter} from "./filter.js";
import {PROJECTS, GROUP_PROJECTS} from "../data/projects.js";

const iconLink = (href, label, icon) =>
    `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}"><i class="${icon}"></i></a>`;

function card(project, index) {
    const number = String(index + 1).padStart(2, "0");
    const links =
        (project.homepage
            ? iconLink(
                  project.homepage,
                  `${project.t} live demo`,
                  "fas fa-arrow-up-right-from-square",
              )
            : "") +
        iconLink(repoUrl(project), `${project.t} repository`, "fab fa-github");
    const filters = [
        project.category && `data-category="${esc(project.category)}"`,
        project.featured && "data-featured",
    ]
        .filter(Boolean)
        .join(" ");

    return `<article class="card project fx" data-tilt ${filters}>
        <div class="project-art" style="--c: var(--${project.c})">
            <span>${number} / ${esc(project.k)}</span><i class="fas ${project.icon}" aria-hidden="true"></i><b>${esc(project.line)}</b>
        </div>
        <div class="project-body">
            <div class="row"><h3>${esc(project.t)}</h3><div class="links">${links}</div></div>
            <p>${esc(project.d)}</p>
            <div class="tags">${project.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        </div>
    </article>`;
}

export function initProjects() {
    const grid = $("#projects-grid");
    grid.innerHTML = PROJECTS.map(card).join("");
    $("#group-projects-grid").innerHTML = GROUP_PROJECTS.map(card).join("");

    setupFilter({
        box: $("#project-filters"),
        cards: $$(".project", grid),
        keysOf: (el) => [
            el.dataset.category,
            ...("featured" in el.dataset ? ["Featured"] : []),
        ],
        lead: ["Featured"],
        initial: "Featured",
        onCount: (shown, total) =>
            ($("#project-count").textContent =
                `Showing ${shown} of ${total} projects`),
    });
}
