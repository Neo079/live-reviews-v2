# Live Reviews
By - Pratham Pagar
A small full-stack app for adding, editing and removing reviews, with a list that updates **live** across every open browser tab through WebSockets.

- **Backend:** Node.js, Express, `ws`, SQLite (Node's built-in `node:sqlite`)
- **Frontend:** React, Vite, React Router, plain CSS (no CSS framework, no inline styles)

# Getting Started

Requires **Node.js 22.13 or newer** (the backend uses the built-in `node:sqlite` module). No database server needs to be installed.

```bash
# after cloning the repo

cd backend
npm i
npm start

# new terminal

cd frontend
npm i
npm start
```

Then open **http://localhost:3000**. Open it in two tabs to see the live updates.

| Service  | URL                     | Notes                                                |
| -------- | ----------------------- | ---------------------------------------------------- |
| Frontend | `http://localhost:3000` | Vite dev server, proxies `/api` and `/ws` to backend |
| Backend  | `http://localhost:4000` | REST API at `/api/reviews`, WebSocket at `/ws`       |

The backend stores data in `backend/reviews.db`, created automatically on first start. Optional environment variables: `PORT` (default `4000`) and `DB_FILE` (default `reviews.db`).

## Useful scripts

Run these inside `backend/` or `frontend/`:

| Command                | What it does                             |
| ---------------------- | ---------------------------------------- |
| `npm test`             | Runs the unit tests                      |
| `npm run lint`         | Runs ESLint                              |
| `npm run format`       | Formats the code with Prettier           |
| `npm run format:check` | Checks formatting without changing files |
| `npm run build`        | Production build (frontend only)         |

# Problem Statement

## Live Reviews

Live Reviews allows users to add/edit/remove review and view all reviews with live feeding.

### Must Haves

#### Backend

- Use any DB and NodeJS framework of your choice
- Create REST APIs to perform CRUD operations of notes
- Store each review with id, title, content and date-time
- Implement web-socket, which should broadcast whenever any review is getting added/edited/deleted

#### Frontend

- We are only looking for decent UI, which can just work.
- Please start with plain HTML first, do not worry about CSS. Complete rest of the functionalities and then if time permits, continue improving UI.
- Please do not use any css framework like bootstrap, tailwind, etc.
- You can use either React, Vue, Angular or vanilla HTML/CSS/JavaScript.
- Inline styles not allowed.

**Reviews List View (Default View, route = /)**

- A button to create new review - clicking on which user will be redirected to /new/ route
- Basic Table layout with all reviews
- Table should have 6 columns: #, Title, Content, Date-time, Edit, Delete
  - \# - Static count number starting with 1
  - Edit - a edit button, clicking on which user will be redirected to /:id route
  - Delete - a delete button, clicking on which review will be deleted
- Show each review in separate row
- Latest review should be displayed first
- This should be a live list view with implementation of web-socket, so whenever any review is added/edited/deleted, it should immediately update the table without user needing to refresh the page

**New Review (route = /new)**

- 1 input for title
- 1 textarea for content
- Save button - saves the review, and redirects user back to list view, i.e. route /
- Reset button - resets the review content and title
- Cancel button - redirects user back to list view, i.e. route /

**Edit Review (route = /:id)**

- Re-use the same component from New Review
- Pre-fill the title and content from the existing review
- Delete button - deletes the review, and redirects user back to list view, i.e. route /

### Nice to have

You will be given bonus marks for completing any of the below task, but make sure to complete all the must haves first:

- Highlight different live events in different colors
  - When new review is added, highlight it with green color in table for 3 seconds
  - When any review is edited, highlight it with blue color in table for 3 seconds
  - When new review is deleted, highlight it with red color in table for 3 seconds and then it should disappear
- Once user deletes the note, either from list or from note itself, show a snackbar/toastr with success message and an undo button
  - Snackbar/toastr should be visible for 5 seconds
  - User can undo the deletion by clicking on undo button
- Unit testing
- Sorting functionality based on title and date-time in both, ascending and descending order
- Search functionality

# Completed

All must-haves and all of the nice-to-haves are done.

### Must Haves

#### Backend

- [x] Node.js with Express, using SQLite as the database
- [x] REST APIs for create, read, update and delete of reviews
- [x] Each review is stored with `id`, `title`, `content` and `dateTime`
- [x] WebSocket server that broadcasts whenever a review is added, edited or deleted

#### Frontend

- [x] React with plain CSS files: no CSS framework and no inline styles
- [x] **List view (`/`):** "New review" button, a table with the 6 columns `#`, Title, Content, Date-time, Edit and Delete, one review per row, latest first, with `#` as a static count starting at 1
- [x] **Live list:** the table updates immediately on every add, edit and delete without a refresh
- [x] **New review (`/new`):** title input, content textarea, and Save, Reset and Cancel buttons
- [x] **Edit review (`/:id`):** reuses the same form component, pre-filled, with an extra Delete button; Save, Cancel and Delete return to `/`

### Nice to have

- [x] **Live event highlights:** green for 3 seconds when a review is added, blue for 3 seconds when edited, and red for 3 seconds when deleted, after which the row disappears
- [x] **Delete snackbar with undo:** shown after deleting from the list or from the edit page, visible for 5 seconds, and Undo brings the review back
- [x] **Unit tests:** backend (`node:test`) and frontend (Vitest), 26 tests in total
- [x] **Sorting:** by title and by date-time, ascending and descending, by clicking the column headers
- [x] **Search:** case-insensitive search over title and content

Also added: ESLint and Prettier in both apps.

# How It Works

## Project structure

```
.
├── .prettierrc.json              Shared Prettier config
├── backend/
│   ├── src/
│   │   ├── server.js             Starts HTTP + WebSocket, wires everything together
│   │   ├── app.js                Express routes
│   │   ├── db.js                 SQLite access (node:sqlite)
│   │   ├── validation.js         Input validation
│   │   └── websocket.js          WebSocket server and broadcast()
│   └── tests/                    API and validation tests
└── frontend/
    └── src/
        ├── App.jsx               Routes, live data, snackbar wiring
        ├── api/reviewsApi.js     All REST calls in one place
        ├── hooks/
        │   ├── useReviews.js     Fetch, WebSocket sync, highlights
        │   └── useSnackbar.js    5-second snackbar state
        ├── pages/                List page and the shared New/Edit page
        ├── components/           ReviewForm, ReviewsTable, Snackbar
        ├── utils/reviewList.js   Pure helpers: search, sort, apply live events
        └── styles/               Plain CSS files
```

## REST API

Base path: `/api/reviews`

| Method   | Path       | Description                                       | Success |
| -------- | ---------- | ------------------------------------------------- | ------- |
| `GET`    | `/`        | All reviews, newest first                         | 200     |
| `GET`    | `/:id`     | One review                                        | 200     |
| `POST`   | `/`        | Create (`title`, `content`); server sets id, time | 201     |
| `PUT`    | `/:id`     | Update `title` and `content`                      | 200     |
| `DELETE` | `/:id`     | Delete; returns the deleted review                | 200     |
| `POST`   | `/restore` | Re-create a deleted review (used by Undo)         | 201     |

Errors return `{ "error": "message" }` with `400` (invalid input), `404` (unknown id) or `409` (restoring a review that already exists).

A review looks like this:

```json
{
  "id": "6f1c0c1e-5d4b-4a0e-9c52-0d0a1f3b7e11",
  "title": "Great product",
  "content": "Works exactly as described.",
  "dateTime": "2026-11-18T10:30:00.000Z"
}
```

## WebSocket events

Clients connect to `/ws`. After every successful change the server broadcasts a message to all connected clients:

```json
{ "type": "created", "review": { "...": "..." } }
```

| `type`     | Sent when           | Highlight in the table |
| ---------- | ------------------- | ---------------------- |
| `created`  | A review is added   | Green, 3 seconds       |
| `updated`  | A review is edited  | Blue, 3 seconds        |
| `deleted`  | A review is deleted | Red, then removed      |
| `restored` | A delete is undone  | Green, 3 seconds       |

## Design decisions

- **One update path.** Changes go through the REST API, and the list only changes when a WebSocket event arrives. This avoids duplicate rows, and the tab that made the change sees its own change the same way as every other tab.
- **The WebSocket lives in `App`.** One connection stays open while navigating between pages, so saving or deleting on a form page still shows the highlight when you return to the list. It reconnects automatically and refetches after a reconnect so no events are missed.
- **Undo keeps the review's identity.** `DELETE` returns the full review, and Undo sends it to `POST /restore`. The review comes back with its original id and timestamp, so it returns to its original position instead of jumping to the top.
- **Server-generated ids and timestamps.** Ids are UUIDs and the timestamp is set by the server, so clocks in different browsers never disagree. Only the restore endpoint accepts them from the client.
- **Pure helpers for list logic.** Search, sort and live-event handling are plain functions in `utils/reviewList.js`, which makes them straightforward to unit test.
- **Few dependencies.** Backend: `express` and `ws`. Frontend: `react`, `react-dom` and `react-router-dom`. SQLite, UUIDs, `fetch`, `WebSocket` and the backend test runner are all built in.

## Known limitations

- Undo is held in the browser for 5 seconds. Refreshing the page during that time loses the chance to undo, and a second delete replaces the first snackbar.
- Search and sort run in the browser over the full list, which is fine for the size of data this app targets but would need server-side support for very large lists.
- The UI components themselves (hooks and React components) are not unit tested; the tests cover the backend and the list logic.
