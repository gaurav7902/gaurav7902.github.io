export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
];

export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = matchMedia(
    "(hover: hover) and (pointer: fine)",
).matches;

export const USER = "gaurav7902";
export const EMAIL = "patidargaurav7902@gmail.com";

export const esc = (value) =>
    String(value).replace(
        /[&<>"]/g,
        (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c],
    );

export const repoUrl = (project) =>
    `https://github.com/${project.owner || USER}/${project.r}`;

// "2d ago" style relative time
export const ago = (iso) => {
    const seconds = (Date.now() - new Date(iso)) / 1000;
    const units = [
        [31536000, "y"],
        [2592000, "mo"],
        [86400, "d"],
        [3600, "h"],
        [60, "m"],
    ];
    for (const [size, label] of units)
        if (seconds >= size) return `${Math.floor(seconds / size)}${label} ago`;
    return "just now";
};
