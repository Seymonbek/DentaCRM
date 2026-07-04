// Minimal HTTP server used by the T1 frontend image so `docker compose up`
// yields something reachable on :5173 before Vite is scaffolded in T5.
// It responds with a short HTML page describing the current state.

import http from "node:http";

const PORT = Number.parseInt(process.env.PORT ?? "5173", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

const body = `<!doctype html>
<html lang="uz">
  <head>
    <meta charset="utf-8" />
    <title>DentaCRM — frontend placeholder</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 42rem; color: #1f2937; }
      code { background: #f3f4f6; padding: 0.1rem 0.35rem; border-radius: 4px; }
      h1 { margin-bottom: 0.25rem; }
      .muted { color: #6b7280; }
    </style>
  </head>
  <body>
    <h1>DentaCRM frontend</h1>
    <p class="muted">Task T1 (repo skeleton) is complete. The real Vite + React + TS scaffold lands in task T5.</p>
    <p>Backend API: <code>http://localhost:8000/api/v1/</code></p>
    <p>Swagger:     <code>http://localhost:8000/api/docs/</code></p>
  </body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(body);
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`dentacrm frontend placeholder listening on http://${HOST}:${PORT}`);
});
