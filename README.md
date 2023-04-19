# Introduction

This app is built using [React Hook Form](https://react-hook-form.com/) and [Vite](https://vitejs.dev/) (I really like its hmr very much).

![Screenshot](/docs/screenshot.png)

## Dev Requirement

-   node v16
-   yarn v1 classic

## Setup

Please run `yarn install` after pulling this repository before building.

## Feature

### Create Entry Form

The create form has multiple rules, namely:

1. The "name" and "desc" must be filled in

2. Text-area with counter for "desc"

3. Dynamic sections for multiple "rule" entry

4. Filtering "rule"s with identical field before form submission

### Browse List Display

1. Sorting feature for every field of the display (ascending and descending)

2. Disallow removal of form entries from groups that only have one entry left

### Dynamic layout

1. The layout of the page will change from horizontal display to vertical display accordingly when the viewport shrinks beyong certain range

### Persistent data

1. For **Browse List Display**, I have mocked a server-db design using sw-cache architecture, so that form data can be persisted throughout reloads

2. The page can work without cookies, cache and app permissions, but the data will be gone after reload

### Tests

1. Unit tests (both state and dom tests) are done as a demo using [Vitest](https://vitest.dev/) and integrated into build
