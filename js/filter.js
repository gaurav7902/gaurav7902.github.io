import {$$, esc} from "./utils.js";

/**
 * Turns `box` into a row of filter chips for `cards`.
 * Chip order: `lead` keys, then "All", then the remaining keys by popularity.
 */
export function setupFilter({
    box,
    cards,
    keysOf,
    lead = [],
    initial = "",
    onCount,
}) {
    const count = (key) => cards.filter((c) => keysOf(c).includes(key)).length;
    const keys = [...new Set(cards.flatMap(keysOf))];
    const leading = lead.filter((key) => keys.includes(key));
    const rest = keys
        .filter((key) => !leading.includes(key))
        .sort((a, b) => count(b) - count(a) || a.localeCompare(b));

    const chip = (key, label, n) =>
        `<button class="chip" type="button" data-k="${esc(key)}" aria-pressed="${key === initial}">${esc(label)} <b>${n}</b></button>`;
    box.innerHTML = [
        ...leading.map((key) => chip(key, key, count(key))),
        chip("", "All", cards.length),
        ...rest.map((key) => chip(key, key, count(key))),
    ].join("");

    const apply = (key) => {
        let shown = 0;
        cards.forEach((card) => {
            const match = !key || keysOf(card).includes(key);
            card.hidden = !match;
            if (match) {
                shown++;
                card.classList.remove("pop");
                void card.offsetWidth; // restart the pop animation
                card.classList.add("pop");
            }
        });
        onCount?.(shown, cards.length);
    };

    box.addEventListener("click", (e) => {
        const button = e.target.closest(".chip");
        if (!button) return;
        $$(".chip", box).forEach((b) =>
            b.setAttribute("aria-pressed", String(b === button)),
        );
        apply(button.dataset.k);
    });
    apply(initial);
}
