// Refreshes data/github.json from the GitHub API.
//   node scripts/sync-github.mjs
// Set GITHUB_TOKEN to avoid rate limits (the workflow does this for you).
import {mkdir, writeFile} from "node:fs/promises";

const USER = process.env.GH_USER || "gaurav7902";
const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-sync",
    ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
};

async function get(url) {
    const response = await fetch(url, {headers});
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.json();
}

const user = await get(`https://api.github.com/users/${USER}`);
const repos = [];
for (let page = 1; ; page++) {
    const batch = await get(
        `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&page=${page}`,
    );
    repos.push(...batch);
    if (batch.length < 100) break;
}

const snapshot = {
    generated: new Date().toISOString(),
    user: {followers: user.followers, public_repos: user.public_repos},
    repos: repos.map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        fork: r.fork,
        stars: r.stargazers_count,
        pushed_at: r.pushed_at,
        homepage: r.homepage || null,
        topics: r.topics,
        url: r.html_url,
    })),
};

await mkdir("data", {recursive: true});
await writeFile("data/github.json", JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Wrote ${snapshot.repos.length} repos for ${USER}`);
