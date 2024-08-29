import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import wishlist from "./routes/wishlist.js";

export const app = express();

app.use(express.json());

/** Handles all server api requests. */
app.use("/api", wishlist);

/** If not requesting the API, serve the application client. */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticPath = path.join(__dirname, "../../dist/client");
app.use(express.static(staticPath));
app.get("*", (_req: Request, res: Response) => {
	res.sendFile(path.join(staticPath, "index.html"));
});

/** Custom error handler. */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: err.message || "Unknown Error" });
});
