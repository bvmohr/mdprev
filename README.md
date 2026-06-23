# mdprev

![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

***Contributor***: Brian Mohr

A premium, lightweight, real-time Markdown previewer with syntax highlighting, live auto-save, and fluid theme controls. Statically served and ready to run anywhere.

***Note***: This project uses `marked` for Markdown parsing, `DOMPurify` for HTML cleaning, and `Prism.js` for dynamic code syntax highlighting.

## Features

- **Real-Time Live Preview**: Compiles and renders your markdown on the fly as you type.
- **Rich Formatting Toolbar**: Quick-insert buttons for headers (H1, H2, H3), typography styles (bold, italic, strikethrough), code (inline and block), blockquotes, links, images, lists (unordered, ordered, checklists), tables, and horizontal lines.
- **Flexible Workspace Layouts**:
  - **Split**: Side-by-side editing and previewing.
  - **Editor Only**: Full focus on writing.
  - **Preview Only**: Fullscreen reading and proofing.
- **Dynamic Syntax Highlighting**: Auto-styles code snippets in common languages using Prism.js.
- **Scroll Synchronization**: Smooth, simultaneous scrolling between the editor and preview panels (can be toggled in the footer).
- **Theme Customization**: Responsive dark and light themes that auto-detect system settings and allow manual toggles.
- **State Persistence**: Auto-saves your markdown draft to local storage so you never lose your work on page reload.
- **Import & Export**:
  - **Drag-and-Drop**: Drag local `.md` or `.txt` files directly into the editor.
  - **Download Options**: Save raw Markdown (`.md`) or compiled HTML documents.
  - **Copy Actions**: Copy raw Markdown or compiled HTML straight to your clipboard.
- **Status Metrics**: Real-time word count, character count, and estimated reading time indicator in the status bar.

## Project Structure

The project has a clean, decoupled structure:
- **index.html**: The main page structure, layouts, and external assets.
- **style.css**: Premium design, light/dark themes, layout structure, and typography styles.
- **script.js**: Core application controller logic, formatting functions, event listeners, and drag-and-drop file imports.

## Motivation

I use Markdown frequently and I needed a free, lightweight, previewer tool that I can quickly search up and use on any device. I didn't want to rely on heavy editors (such as VSCode, Notion, Obsidian, etc.) for simple Markdown previews.

## Usage

Navigate to the hosted GitHub Page [here]() and start writing!

## Acknowledgements & AI Assistance

This codebase was developed with the assistance of Google Gemini (via the Antigravity agentic AI coding assistant).