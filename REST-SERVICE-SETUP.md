# REST Service Setup (Activity 1 / Express Music API)

This project includes a **built-in API server** that reads from your MySQL database. Use it when you want the React app to use the DB.

## 0. Use the built-in API server (recommended)

1. **Start MySQL** (e.g. MAMP with MySQL on port 3306).
2. **Create the database** in phpMyAdmin by running `database/music_schema.sql` (or your own schema).
3. **Start the API** in this project:
   ```bash
   npm run server
   ```
   The API runs at `http://localhost:3000`. It connects to MySQL (default: `localhost:3306`, user `root`, password `root`, database `music`). To override, set env vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
4. **Start the React app** in another terminal: `npm start` (opens at `http://localhost:3001`). Album cards load from the database via the API.

---

Use this checklist to ensure the Express application is working before using it with the React app.

## 1. Locate the REST service project

The rest service music app has a structure like:

- `app/` — source (e.g. `app/index.js`, `app/database/MusicDAO.ts`, `app/models/`)
- `lib/` — compiled output (e.g. `lib/app/index.js`)
- `package.json`, `tsconfig.json`, `.babelrc`

Open that project in your course folder (e.g. **Activity 1** or wherever the Express Music API was built).

## 2. Start the Express application

In the **rest service** project directory:

```bash
# Install dependencies (if needed)
npm install

# If the project uses TypeScript and compiles to lib/:
npm run build
node lib/app/index.js

# Or if package.json has a start script:
npm start
```

The server should listen on **port 3000** (or the port configured in the app).

## 3. Test in the browser

With the server running, open:

| URL | Purpose |
|-----|--------|
| `http://localhost:3000/albums/search/description/Help` | Search albums by description (e.g. "Help") |
| `http://localhost:3000/albums` | List all albums (if the route exists) |

You should see **JSON** in the browser (e.g. album with `id`, `title`, `artist`, `description`, `year`, `image`, `tracks`).  
See **Figure 33** for the expected response shape.

## 4. Confirm MySQL data (Figure 34)

- Start **MAMP** (or your MySQL stack) and ensure **Apache** and **MySQL** are running.
- Open **phpMyAdmin** (e.g. `http://localhost:8889` or your MAMP ports).
- Select the **music** database.
- Open the **ALBUM** table (and **TRACK** if used).
- Confirm you have several albums with columns such as: **ID**, **TITLE**, **ARTIST**, **YEAR**, **IMAGE_NAME**, **DESCRIPTION**.

If the ALBUM table is empty, add or import data from your earlier course assignments.

## 5. Run the React app with the REST service

- Keep the **Express server** running on port 3000.
- In **this** project (Activity 2 music), run: `npm start`.
- In the React app, use the search box and submit a term (e.g. "Help"); results should load from `http://localhost:3000/albums/search/description/...`.

## Troubleshooting

- **CORS errors** — Enable CORS on the Express app for `http://localhost:3001` (or whatever port React uses).
- **Empty or 404 response** — Check Express routes and that they match `/albums/search/description/:term`. Ensure MySQL is running and the `music` database has data.
- **Wrong port** — If Express uses a different port, set `REST_API_BASE` in `src/App.js` to that URL (e.g. `http://localhost:3001` if the API is on 3001).
