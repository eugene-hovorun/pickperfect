import { mount } from "svelte";
import App from "./App.svelte";
import "../app.css";
import { initTheme } from "$lib/theme";

// Initialize theme before mount to prevent flash of wrong theme
initTheme().then(() => mount(App, { target: document.getElementById("app")! }));
