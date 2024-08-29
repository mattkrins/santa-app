import { assert, describe, expect, test, vi } from "vitest";
import { app } from "../../src/server/index";
import inject from "light-my-request";
import { AlternativeValidationError } from "express-validator";
import initDatabase, { database } from "../../src/server/services/database";

vi.mock("../../src/server/services/database", () => ({
	__esModule: true,
	default: () => vi.fn(),
	database: {
		users: [
			{
				username: "charlie.brown",
				uid: "730b0412-72c7-11e9-a923-1681be663d3e",
			},
			{
				username: "james.bond",
				uid: "730b06a6-72c7-11e9-a923-1681be663d3e",
			},
		],
		profiles: [
			{
				userUid: "730b0412-72c7-11e9-a923-1681be663d3e",
				address: "219-1130, Ikanikeisaiganaibaai, Musashino-shi, Tokyo",
				birthdate: "2017/12/05",
			},
			{
				userUid: "730b06a6-72c7-11e9-a923-1681be663d3e",
				address: "365-1095, Minowada, Shirataka-machi Nishiokitama-gun, Yamagata",
				birthdate: "1987/01/01",
			},
		],
		pendingWishes: [],
	},
}));

describe("WishList Mocked Route", () => {
	test("fetch database", async () => {
		await initDatabase();
	});
	test("submits the form successfully", async () => {
		const response = await inject(app, {
			method: "POST",
			url: "/api/wish",
			payload: { username: "charlie.brown", wishlist: "I want a football" },
		});
		expect(response.statusCode).toBe(200);
		const json = JSON.parse(response.payload) as string;
		expect(json).toBe("charlie.brown");
		expect(database.pendingWishes).toHaveLength(1);
		expect(database.pendingWishes[0].list).toBe("I want a football");
	});
	test("return validation error for invalid username", async () => {
		const response = await inject(app, {
			method: "POST",
			url: "/api/wish",
			payload: { username: "invalidusername", wishlist: "I want a football" },
		});
		expect(response.statusCode).toBe(422);
		const json = JSON.parse(response.payload) as { errors: AlternativeValidationError[] };
		assert.hasAllKeys(json, ["errors"]);
		expect(json.errors.find(e => e.msg === "Invalid value")?.type).toBe("field");
	});
	test("return validation error for unregistered user", async () => {
		const response = await inject(app, {
			method: "POST",
			url: "/api/wish",
			payload: { username: "invalid.username", wishlist: "I want a football" },
		});
		expect(response.statusCode).toBe(422);
		const json = JSON.parse(response.payload) as { errors: AlternativeValidationError[] };
		assert.hasAllKeys(json, ["errors"]);
		expect(json.errors.find(e => e.msg === "Sorry, you are not registered.")?.type).toBe("field");
	});
	test("return validation error for user over the age of 10", async () => {
		const response = await inject(app, {
			method: "POST",
			url: "/api/wish",
			payload: { username: "james.bond", wishlist: "I want a gameboy" },
		});
		expect(response.statusCode).toBe(422);
		const json = JSON.parse(response.payload) as { errors: AlternativeValidationError[] };
		assert.hasAllKeys(json, ["errors"]);
		expect(json.errors.find(e => e.msg === "Sorry, you are too old now!")?.type).toBe("field");
	});
});
