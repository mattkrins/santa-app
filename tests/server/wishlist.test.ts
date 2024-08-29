import { assert, describe, expect, test } from "vitest";
import { app } from "../../src/server/index";
import inject from "light-my-request";
import { AlternativeValidationError } from "express-validator";

describe("WishList Route", () => {
	test("return validation errors on empty submit", async () => {
		const response = await inject(app, {
			method: "POST",
			url: "/api/wish",
		});
		expect(response.statusCode).toBe(422);
		const json = JSON.parse(response.payload) as { errors: AlternativeValidationError[] };
		assert.hasAllKeys(json, ["errors"]);
		expect(json.errors.find(e => e.msg === "Invalid value")?.type).toBe("field");
	});
	test("return validation error for invalid username", async () => {
		const response = await inject(app, {
			method: "POST",
			url: "/api/wish",
			payload: JSON.stringify({ username: "invalidusername", wishlist: "I want a football" }),
		});
		expect(response.statusCode).toBe(422);
	});
	test("return validation error for unregistered user", async () => {
		const response = await inject(app, {
			method: "POST",
			url: "/api/wish",
			payload: { username: "charlie.brown", wishlist: "I want a football" },
		});
		expect(response.statusCode).toBe(422);
		const json = JSON.parse(response.payload) as { errors: AlternativeValidationError[] };
		assert.hasAllKeys(json, ["errors"]);
		expect(json.errors.find(e => e.msg === "Sorry, you are not registered.")?.type).toBe("field");
	});
});
