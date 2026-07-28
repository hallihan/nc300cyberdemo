import { mount } from 'svelte';
import App from './App.svelte';

// Svelte 5 replaces `new App({ target })` with mount().
export default mount(App, { target: document.body });
