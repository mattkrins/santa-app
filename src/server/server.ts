import "dotenv/config";
import process from "process";
import { app } from "./index.js";
import initDatabase from "./services/database.js";
import initMailer from "./services/mailer.js";

/**
 * Start the server
 **/
async function init() {
	await initDatabase();
	initMailer();
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`  ➜  Server: http://localhost:${PORT}`));
}

init();
