import { describe, expect, test, vi } from "vitest";
import { database } from "../../src/server/services/database";
import { sendPendingWishes } from "../../src/server/services/mailer";
import nodemailer, { TestAccount } from "nodemailer";

vi.mock("../../src/server/services/database", () => ({
	__esModule: true,
	default: () => vi.fn(),
	database: {
		users: [],
		profiles: [],
		pendingWishes: [
			{
				username: "charlie.brown",
				address: "219-1130, Ikanikeisaiganaibaai, Musashino-shi, Tokyo",
				list: "2017/12/05",
			},
		],
	},
}));

// Creates testing email account @ https://ethereal.email
function createEtherealAccount() {
	return new Promise<TestAccount>((resolve, reject) => {
		nodemailer.createTestAccount(async (err, account) => {
			if (err) return reject(err);
			resolve(account);
		});
	});
}

describe("Mailer service", () => {
	test("Send pending wishes", async () => {
		expect(database.pendingWishes).toHaveLength(1);
		const account = await createEtherealAccount();
		const transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false,
			auth: {
				user: account.user, // generated ethereal user
				pass: account.pass, // generated ethereal password
			},
		});
		const mail = await sendPendingWishes(transporter);
		expect(database.pendingWishes).toHaveLength(0);
		expect(mail).toBeTruthy();
		if (mail) console.log("Preview URL: " + nodemailer.getTestMessageUrl(mail));
	}, 15000);
});
