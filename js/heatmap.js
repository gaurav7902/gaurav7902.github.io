import {$, esc} from "./utils.js";
import {onGitHub} from "./github.js";

const dateLabel = (date) =>
    date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
const levelOf = (value, values) => {
    if (!value) return 0;
    const sorted = [...values].filter(Boolean).sort((a, b) => a - b);
    if (!sorted.length) return 1;
    const rank = sorted.indexOf(value) / sorted.length;
    return Math.min(4, Math.floor(rank * 4) + 1);
};

function calendarColumns(calendar) {
    const start = new Date(`${calendar.start}T00:00:00Z`);
    const values = calendar.counts || [];
    const levels = values.map((value) => levelOf(value, values));
    const columns = [];
    for (let offset = 0; offset < values.length; offset += 7) {
        const cells = [];
        for (let row = 0; row < 7; row++) {
            const index = offset + row;
            const date = new Date(start);
            date.setUTCDate(start.getUTCDate() + index);
            cells.push({
                date,
                count: values[index] || 0,
                level: levels[index] || 0,
            });
        }
        columns.push(cells);
    }
    return {
        columns,
        total: calendar.total ?? values.reduce((sum, value) => sum + value, 0),
        caption: "contributions in the last year",
    };
}

function fallbackColumns(repositories) {
    const now = new Date();
    const columns = [];
    for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
        const date = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthOffset, 1),
        );
        const count = repositories.filter((repo) => {
            const pushed = new Date(repo.pushed_at);
            return (
                pushed.getUTCFullYear() === date.getUTCFullYear() &&
                pushed.getUTCMonth() === date.getUTCMonth()
            );
        }).length;
        const cells = Array.from({length: 7}, (_, row) => ({
            date: new Date(
                Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), row + 1),
            ),
            count: row === 0 ? count : 0,
            level: row === 0 ? Math.min(count, 4) : 0,
        }));
        columns.push(cells);
    }
    return {
        columns,
        total: repositories.length,
        caption: "repository pushes by month",
    };
}

function render(summary) {
    const root = $("#heatmap");
    if (!root) return;
    const model =
        summary.calendar?.start && summary.calendar?.counts
            ? calendarColumns(summary.calendar)
            : summary.repositories?.length
              ? fallbackColumns(summary.repositories)
              : null;
    if (!model) {
        root.hidden = true;
        return;
    }
    root.hidden = false;
    root.setAttribute("aria-label", `${model.total} ${model.caption}`);
    root.querySelector(".heatmap-summary").textContent =
        `${model.total} ${model.caption}`;
    const labels = model.columns
        .map((column, index) => {
            const date = column[0].date;
            return date.getUTCDate() <= 7
                ? `<span style="--i:${index}">${date.toLocaleDateString("en-US", {month: "short", timeZone: "UTC"})}</span>`
                : "";
        })
        .join("");
    root.querySelector(".heatmap-months").innerHTML = labels;
    root.querySelector(".heatmap-grid").innerHTML = model.columns
        .map(
            (column, columnIndex) =>
                `<div class="heatmap-column" style="--i:${columnIndex}">${column.map((cell) => `<i class="heat-cell level-${cell.level}" title="${esc(`${dateLabel(cell.date)}: ${cell.count} contribution${cell.count === 1 ? "" : "s"}`)}"${cell.date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) ? " data-today" : ""}></i>`).join("")}</div>`,
        )
        .join("");
    requestAnimationFrame(() => {
        const scroller = root.querySelector(".heatmap-scroll");
        scroller.scrollLeft = scroller.scrollWidth;
    });
}

export function initHeatmap() {
    onGitHub(render);
}
