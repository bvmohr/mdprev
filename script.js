// Elements
const inputArea = document.getElementById('input-area');
const outputArea = document.getElementById('output-area');
const fileInput = document.getElementById('file-input');
const wordCountEl = document.getElementById('word-count');
const charCountEl = document.getElementById('char-count');
const readTimeEl = document.getElementById('read-time');
const syncScrollChk = document.getElementById('sync-scroll-chk');
const mainWorkspace = document.getElementById('main-workspace');

// Global State Variables
let syncScrollActive = true;
let isScrollingEditor = false;
let isScrollingPreview = false;

// Sample Markdown Document for initial visits
const sampleMarkdown = `# ⚡ Premium Markdown Previewer (mdprev)

Welcome to your new, highly functional **Markdown Previewer**! Type in the editor on the left and see the styled HTML output on the right instantly.

## Core Features

- **Real-time Live Preview**: Compiles and renders your markdown on the fly.
- **Light & Dark Themes**: Auto-detects system settings or toggles manually.
- **Split & Fullscreen Layouts**: Focus on writing with **Editor Only**, proof with **Preview Only**, or view side-by-side in **Split** mode.
- **Helper Formatting Toolbar**: Insert headers, quotes, lists, inline/block code, and links with a single click.
- **Prism.js Syntax Highlighting**: Auto-styles code snippets in common languages.
- **Auto-Save & Drag-Drop**: Persists work to local storage; lets you drop in local \`.md\` files directly.
- **Export Capabilities**: Copy HTML / Markdown with ease or download raw files.

---

## Interactive Formatting sandbox

### Typography & Formatting
- Write text in **bold**, *italics*, ~~strikethrough~~, or ***all three at once***!
- Use sub-scripts (e.g. H<sub>2</sub>O) or custom inline HTML.

### Blockquotes
> "Code is like humor. When you have to explain it, it's bad."
> — *Cory House*

### Code Highlighting
Here is an inline snippet: \`const active = true;\`. Below is a JavaScript snippet highlighting:

\`\`\`javascript
// Greet the developer
function greetUser(name = 'Developer') {
    const greeting = \`Welcome back, \${name}! Ready to code?\`;
    console.log(greeting);
    return greeting;
}

greetUser('Brian');
\`\`\`

And a python script:

\`\`\`python
def find_average(numbers):
    if len(numbers) == 0:
        return 0
    return sum(numbers) / len(numbers)
\`\`\`

### Data Tables

| Name | Role | Status |
| :--- | :--- | :--- |
| Brian | Owner | Active |
| Antigravity | Assistant | Active |
| Marked.js | Parser | Active |

### Lists & Checklists
1. Key Milestones
   - [x] Custom CSS style rules
   - [x] Toast notices
   - [ ] Multi-tab editor
2. Optional Settings
   - [x] Scroll synchronization
   - [ ] Custom theme presets

---
Enjoy writing! Click the red 🗑️ icon in the top right navbar to clear this template.
`;

// Wait for Marked and DOMPurify libraries to load before initializing
window.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeContent();
    setupEventListeners();
    updatePreview();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('mdprev_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = systemPrefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', defaultTheme);
        updateThemeIcon(defaultTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mdprev_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Theme switched to ${newTheme} mode.`);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (theme === 'dark') {
        // Sun SVG for Dark Theme
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
        btn.setAttribute('data-tooltip', 'Switch to Light Mode');
    } else {
        // Moon SVG for Light Theme
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
        btn.setAttribute('data-tooltip', 'Switch to Dark Mode');
    }
}

// Content Loading
function initializeContent() {
    const savedContent = localStorage.getItem('mdprev_content');
    if (savedContent !== null) {
        inputArea.value = savedContent;
    } else {
        inputArea.value = sampleMarkdown;
    }
}

// Sync View Layouts
function switchView(mode) {
    mainWorkspace.classList.remove('view-split', 'view-editor', 'view-preview');
    mainWorkspace.classList.add(`view-${mode}`);

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`view-${mode}-btn`).classList.add('active');
}

// Core Parsing & Stats Update
function updatePreview() {
    const rawMarkdown = inputArea.value;
    localStorage.setItem('mdprev_content', rawMarkdown);

    if (window.marked && window.DOMPurify) {
        // Configure marked for custom highlights and task checklists
        marked.use({
            gfm: true,
            breaks: true
        });
        
        const dirty = marked.parse(rawMarkdown);
        const clean = DOMPurify.sanitize(dirty);
        outputArea.innerHTML = clean;

        // Execute prism layout styling
        if (window.Prism) {
            Prism.highlightAllUnder(outputArea);
        }
    } else {
        outputArea.innerText = "Parsing libraries loading...";
    }

    // Update Word/Char Metrics
    updateStats(rawMarkdown);
}

function updateStats(text) {
    const chars = text.length;
    const cleanText = text.trim();
    const words = cleanText === '' ? 0 : cleanText.split(/\s+/).filter(w => w.length > 0).length;
    const readTime = Math.max(1, Math.ceil(words / 200));

    wordCountEl.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    charCountEl.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    readTimeEl.textContent = `${readTime} min read`;
}

// Insert Quick Tags
function wrapSelection(before, after) {
    const start = inputArea.selectionStart;
    const end = inputArea.selectionEnd;
    const text = inputArea.value;
    const selection = text.substring(start, end);
    const replacement = before + selection + after;

    inputArea.value = text.substring(0, start) + replacement + text.substring(end);
    
    inputArea.focus();
    const nextPos = start + before.length + selection.length + after.length;
    inputArea.setSelectionRange(nextPos, nextPos);

    updatePreview();
}

// Scroll Sync Toggles
function toggleSyncScroll() {
    syncScrollActive = syncScrollChk.checked;
    showToast(`Scroll sync ${syncScrollActive ? 'enabled' : 'disabled'}.`);
}

// Import/Export and File Actions
function triggerUpload() {
    fileInput.click();
}

// Clear Editor with a prompt
function clearEditor() {
    if (inputArea.value.trim() === '') return;
    if (confirm('Are you sure you want to clear the editor? This will erase all unsaved work.')) {
        inputArea.value = '';
        updatePreview();
        showToast('Editor cleared.');
    }
}

function copyMarkdown() {
    if (inputArea.value.trim() === '') {
        showToast('Nothing to copy.');
        return;
    }
    navigator.clipboard.writeText(inputArea.value)
        .then(() => showToast('Markdown copied to clipboard.'))
        .catch(() => showToast('Copy failed.'));
}

// Copy Compiled HTML
function copyHTML() {
    if (outputArea.innerHTML.trim() === '') {
        showToast('Nothing to copy.');
        return;
    }
    navigator.clipboard.writeText(outputArea.innerHTML)
        .then(() => showToast('HTML copied to clipboard.'))
        .catch(() => showToast('Copy failed.'));
}

function downloadMarkdown() {
    const content = inputArea.value;
    if (content.trim() === '') {
        showToast('Nothing to download.');
        return;
    }
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mdprev-document.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloading Markdown file...');
}

function downloadHTML() {
    const content = outputArea.innerHTML;
    if (content.trim() === '') {
        showToast('Nothing to download.');
        return;
    }
    const docHeader = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; color: #0f172a; background-color: #f8fafc; }
        pre { background: #f1f5f9; padding: 16px; border-radius: 8px; overflow: auto; border: 1px solid #e2e8f0; }
        code { background: #f1f5f9; padding: 0.2em 0.4em; border-radius: 4px; font-size: 85%; font-family: monospace; color: #e11d48; }
        blockquote { border-left: 4px solid #6366f1; background-color: #f1f5f9; padding: 8px 16px; margin: 0 0 16px; border-radius: 0 8px 8px 0; color: #64748b; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
        table th, table td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
        table tr:nth-child(even) { background-color: #f1f5f9; }
        h1, h2, h3 { border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    </style>
</head>
<body>
    <div class="markdown-body">
        ${content}
    </div>
</body>
</html>`;
    const blob = new Blob([docHeader], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mdprev-compiled.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloading compiled HTML...');
}

// Toast System
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    // Clear any existing timeout on it
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

// Setup Listeners
function setupEventListeners() {
    // Live Input parser
    inputArea.addEventListener('input', updatePreview);

    // File Upload Listener
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            inputArea.value = evt.target.result;
            updatePreview();
            showToast(`Imported ${file.name} successfully.`);
        };
        reader.readAsText(file);
        // Reset input
        fileInput.value = '';
    });

    // Drag & Drop Listeners
    inputArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        inputArea.style.borderColor = 'var(--accent-color)';
        inputArea.style.boxShadow = '0 0 0 2px rgba(var(--accent-rgb), 0.2)';
    });

    inputArea.addEventListener('dragleave', () => {
        inputArea.style.borderColor = '';
        inputArea.style.boxShadow = '';
    });

    inputArea.addEventListener('drop', (e) => {
        e.preventDefault();
        inputArea.style.borderColor = '';
        inputArea.style.boxShadow = '';

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                inputArea.value = evt.target.result;
                updatePreview();
                showToast(`Dropped & Imported ${file.name}.`);
            };
            reader.readAsText(file);
        } else {
            showToast('Invalid file format. Please drop .md or .txt files.');
        }
    });

    // Scroll Sync Listeners
    inputArea.addEventListener('scroll', () => {
        if (!syncScrollActive || isScrollingPreview) return;
        isScrollingEditor = true;
        const maxEditorScroll = inputArea.scrollHeight - inputArea.clientHeight;
        const scrollPct = maxEditorScroll > 0 ? (inputArea.scrollTop / maxEditorScroll) : 0;
        
        const maxPreviewScroll = outputArea.scrollHeight - outputArea.clientHeight;
        outputArea.scrollTop = scrollPct * maxPreviewScroll;
        
        // Release lock after a tiny window
        setTimeout(() => {
            isScrollingEditor = false;
        }, 50);
    });

    outputArea.addEventListener('scroll', () => {
        if (!syncScrollActive || isScrollingEditor) return;
        isScrollingPreview = true;
        const maxPreviewScroll = outputArea.scrollHeight - outputArea.clientHeight;
        const scrollPct = maxPreviewScroll > 0 ? (outputArea.scrollTop / maxPreviewScroll) : 0;
        
        const maxEditorScroll = inputArea.scrollHeight - inputArea.clientHeight;
        const textarea = inputArea;
        textarea.scrollTop = scrollPct * maxEditorScroll;

        // Release lock after a tiny window
        setTimeout(() => {
            isScrollingPreview = false;
        }, 50);
    });
}
