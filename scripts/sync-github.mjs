// Refreshes data/github.json from the GitHub API.
//   node scripts/sync-github.mjs
// Set GH_PAT or GITHUB_TOKEN to avoid rate limits and read the calendar.
import {mkdir, writeFile} from "node:fs/promises";

const USER = process.env.GH_USER || "gaurav7902";
const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-sync",
    ...((process.env.GH_PAT || process.env.GITHUB_TOKEN) && {
        Authorization: `Bearer ${process.env.GH_PAT || process.env.GITHUB_TOKEN}`,
    }),
};

async function get(url) {
    const response = await fetch(url, {headers});
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.json();
}

async function getCalendar() {
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {...headers, "Content-Type": "application/json"},
        body: JSON.stringify({
            query: `query ($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`,
            variables: {login: USER},
        }),
    });
    if (!response.ok) throw new Error(`${response.status} GraphQL calendar`);
    const result = await response.json();
    const calendar =
        result.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) throw new Error("calendar missing from GraphQL response");
    const days = calendar.weeks.flatMap((week) => week.contributionDays);
    return {
        start: days[0]?.date,
        total: calendar.totalContributions,
        counts: days.map((day) => day.contributionCount),
    };
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

try {
    snapshot.calendar = await getCalendar();
} catch (error) {
    console.warn(
        `Warning: could not sync contribution calendar: ${error.message}`,
    );
}

await mkdir("data", {recursive: true});
await writeFile("data/github.json", JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Wrote ${snapshot.repos.length} repos for ${USER}`);
