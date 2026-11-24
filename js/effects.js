import {$, reduced, finePointer} from "./utils.js";

const ROLES = [
    "full-stack developer",
    "open source contributor",
    "IIT ISM CSE student",
    "builder of small tools",
];

function initTypewriter() {
    const el = $("#typed");
    if (!el || reduced) return;
    let role = 0;
    let chars = ROLES[0].length;
    let deleting = true;
    const tick = () => {
        const word = ROLES[role];
        chars += deleting ? -1 : 1;
        el.textContent = word.slice(0, chars) || "\u00a0";
        let delay = deleting ? 35 : 70;
        if (!deleting && chars === word.length) {
            deleting = true;
            delay = 1500;
        } else if (deleting && chars === 0) {
            deleting = false;
            role = (role + 1) % ROLES.length;
            delay = 300;
        }
        setTimeout(tick, delay);
    };
    setTimeout(tick, 1800);
}

function initCursorGlow() {
    if (!finePointer || reduced) return;
    const glow = $(".cursor-glow");
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    let started = false;

    // eases towards the pointer, then stops until the mouse moves again
    const loop = () => {
        x += (targetX - x) * 0.14;
        y += (targetY - y) * 0.14;
        glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame =
            Math.abs(targetX - x) < 0.5 && Math.abs(targetY - y) < 0.5
                ? 0
                : requestAnimationFrame(loop);
    };

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
            if (!frame) frame = requestAnimationFrame(loop);
        },
        {passive: true},
    );
    const root = document.documentElement;
    root.addEventListener("mouseleave", () => glow.classList.remove("on"));
    root.addEventListener(
        "mouseenter",
        () => started && glow.classList.add("on"),
    );
}

// spotlight on every `.fx` card, 3D tilt on the ones marked `data-tilt`
function initCardEffects() {
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
}

export function initEffects() {
    initTypewriter();
    initCursorGlow();
    initCardEffects();
}
