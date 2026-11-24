import {$, $$, esc} from "./utils.js";
import {setupFilter} from "./filter.js";

// contributions.md is the single source of truth: every "- <url>" line is
// filed under the nearest heading above it.
const SOURCE = "contributions.md";
const KIND = {pull: "PR", discussions: "Discussion", issues: "Issue"};
const COLORS = ["orange", "blue", "yellow", "pink", "lime", "purple"];
const KNOWN_COLORS = {
    "Features / Fixes": "orange",
    "CI/CD": "blue",
    "Version Updates": "yellow",
    Translations: "pink",
    Documentation: "lime",
    "Discussion Mentions": "purple",
    Issues: "orange",
};

export function parseContributions(markdown) {
    const items = [];
    let category = "";
    for (const line of markdown.split(/\r?\n/)) {
        const heading = line.match(/^#{1,3}\s+(.+?)\s*$/);
        if (heading) {
            category = heading[1];
            continue;
        }
        const link = line.match(/^[-*]\s+(https?:\/\/\S+)/);
        if (!link || !category) continue;
        try {
            const [owner, repo, type, number] = new URL(link[1]).pathname
                .split("/")
                .filter(Boolean);
            items.push({
                category,
                owner,
                repo,
                url: link[1],
                label: `${KIND[type] || "Link"} #${number}`,
            });
        } catch {}
    }
    return items;
}

export async function initContributions() {
    const grid = $("#contrib-grid");
    let items;
    try {
        const response = await fetch(SOURCE);
        if (!response.ok) throw new Error(response.statusText);
        items = parseContributions(await response.text());
    } catch {
        grid.innerHTML =
            '<p>Couldn’t load the contribution list. See <a href="https://github.com/gaurav7902">my GitHub</a> instead.</p>';
        return;
    }

    const categories = [...new Set(items.map((item) => item.category))];
    const colorOf = (category) =>
        KNOWN_COLORS[category] ||
        COLORS[categories.indexOf(category) % COLORS.length];

    $("#contrib-count").textContent = items.length;
    $("#hero-contrib")?.replaceChildren(document.createTextNode(items.length));
    grid.innerHTML = items
        .map(
            (
                c,
            ) => `<a class="card contrib fx" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer" data-cat="${esc(c.category)}">
                <span><strong>${esc(c.repo)}</strong><small>${esc(c.owner)} · ${esc(c.label)}</small></span>
                <em class="badge" style="--c: var(--${colorOf(c.category)})">${esc(c.category)}</em>
            </a>`,
        )
        .join("");

    setupFilter({
        box: $("#contrib-filters"),
        cards: $$(".contrib", grid),
        keysOf: (el) => [el.dataset.cat],
    });
}
