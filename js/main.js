import {initUI} from "./ui.js";
import {initEffects} from "./effects.js";
import {initProjects} from "./projects.js";
import {initContributions} from "./contributions.js";
import {initGitHub} from "./github.js";
import {initPalette} from "./palette.js";

// tells the failsafe in index.html that the app started
window.__app = true;

initUI();
initEffects();
initProjects();
initContributions();
initGitHub();
initPalette();
