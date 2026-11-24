import {$, $$, USER, EMAIL, esc, repoUrl, reduced} from "./utils.js";
import {toggleTheme, toast} from "./ui.js";
import {PROJECTS, GROUP_PROJECTS} from "../data/projects.js";
import {openProject} from "./drawer.js";

const goTo = (id) => () =>
    $(id).scrollIntoView({behavior: reduced ? "auto" : "smooth"});
const openUrl = (url) => () => window.open(url, "_blank", "noopener");
const copyEmail = () =>
    (navigator.clipboard
        ? navigator.clipboard.writeText(EMAIL)
        : Promise.reject()
    ).then(
        () => toast("Email copied"),
        () => toast(EMAIL),
    );

const nav = (label, icon, id) => ({
    l: label,
    g: "Navigate",
    i: icon,
    f: goTo(id),
});
const link = (label, icon, url) => ({
    l: label,
    g: "Link",
    i: icon,
    f: openUrl(url),
});

const projectCommands = [...PROJECTS, ...GROUP_PROJECTS].flatMap((p) => [
    {
        l: `Open project: ${p.t}`,
        g: "Project",
        i: "fab fa-github",
        f: () => openProject(p.r),
    },
    ...(p.homepage
        ? [
              {
                  l: `Live demo: ${p.t}`,
                  g: "Demo",
                  i: "fas fa-arrow-up-right-from-square",
                  f: openUrl(p.homepage),
              },
          ]
        : []),
]);

const COMMANDS = [
    nav("Go to About", "fas fa-user", "#about"),
    nav("Go to Projects", "fas fa-folder-open", "#projects"),
    nav("Go to Group projects", "fas fa-people-group", "#group-projects"),
    nav("Go to Open source", "fas fa-code-pull-request", "#contributions"),
    nav("Go to Skills", "fas fa-toolbox", "#skills"),
    nav("Go to Experience", "fas fa-route", "#experience"),
    nav("Go to Contact", "fas fa-envelope", "#contact"),
    {
        l: "Toggle dark / light theme",
        g: "Action",
        i: "fas fa-circle-half-stroke",
        f: toggleTheme,
    },
    {l: "Copy email address", g: "Action", i: "fas fa-copy", f: copyEmail},
    link("GitHub", "fab fa-github", `https://github.com/${USER}`),
    link(
        "LinkedIn",
        "fab fa-linkedin",
        "https://www.linkedin.com/in/gauravpatidar",
    ),
    link("X / Twitter", "fab fa-x-twitter", "https://x.com/ggoravv"),
    link("YouTube", "fab fa-youtube", "https://youtube.com/@go7av"),
    link("Instagram", "fab fa-instagram", "https://instagram.com/go7av"),
    ...projectCommands,
];

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

export function initPalette() {
    const dialog = $("#palette");
    const input = $("#palette-input");
    const list = $("#palette-list");
    let shown = [];
    let selected = 0;

    if (/Mac|iPhone|iPad/.test(navigator.platform))
        $(".kbd-key").textContent = "⌘";

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
        shown = COMMANDS.map((c) => [score(query, `${c.l} ${c.g}`), c])
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
    const open = () => {
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
        else if (e.key === "Escape") {
            e.preventDefault();
            dialog.close();
        }
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
    $$("[data-open-palette]").forEach((b) => b.addEventListener("click", open));
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            dialog.open ? dialog.close() : open();
        } else if (
            e.key === "/" &&
            !dialog.open &&
            !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)
        ) {
            e.preventDefault();
            open();
        }
    });
}
