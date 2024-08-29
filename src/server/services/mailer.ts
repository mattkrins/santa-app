import process from "process";
import nodemailer, { SentMessageInfo, Transporter } from "nodemailer";
import { database } from "./database.js";

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 587,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

/**
 * Sends an email containing the current stack of wishes.
 **/
export async function sendPendingWishes(transport?: Transporter): Promise<SentMessageInfo | false> {
	const wishes = database.pendingWishes;
	if (wishes.length <= 0) return false;

	const wishString = wishes
		.map(
			({ username, address, list }: wish) => `
Username: <b>${username}</b><br/>\n
Address: <b>${address}</b><br/>\n
Wish List: <b>${list}</b><br/>\n
`,
		)
		.join("\n<br/><hr/>\n");

	// Create a backup of the current stack in case of failure.
	const wishesbackup = [...wishes];
	// Empty the stack, more wishes may come in while waiting to send.
	database.pendingWishes = [];
	try {
		return await (transport || transporter).sendMail({
			from: '"do_not_reply@northpole.com',
			to: "santa@northpole.com",
			subject: "Pending Wishes",
			html: `<h2>Pending Wishes</h2><br/>${wishString}`,
		});
	} catch (e) {
		console.error("Failed to send wishes.", e);
		// Prepend the failed messages to the start of the stack to re-send first.
		database.pendingWishes = [...wishesbackup, ...database.pendingWishes];
	}
}

/**
 * Sends an email every x milliseconds
 **/
export default function initMailer(): void {
	setInterval(sendPendingWishes, process.env.MAIL_DELAY ? parseInt(process.env.MAIL_DELAY) : 15000);
}
