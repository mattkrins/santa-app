import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import { Request, Response, Router } from "express";
import { body, matchedData, validationResult } from "express-validator";
import { database } from "../services/database.js";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

const router = Router();

/**
 * POST /api/wish\
 * Pushes a wish to the pending stack.
 * @param {string} username Username for the submission.
 * @param {string} wishlist Wish list for the submission.
 */
router.post(
	"/wish",
	body("username")
		.notEmpty()
		.matches(/^\w+\.\w+$/)
		.escape()
		.custom(async (username: string, { req }) => {
			// Is the user registered?
			const user = database.users.find(user => user.username === username);
			if (!user) throw new Error("Sorry, you are not registered.");
			// Find the user's profile from their unique id.
			const profile = database.profiles.find(profile => profile.userUid === user.uid);
			if (!profile) throw new Error("Profile not found.");
			// Is the user 10 years old or younger?
			const birthDate = dayjs(profile.birthdate, "YYYY/DD/MM", true);
			const tenYearsAgo = dayjs().subtract(10, "year");
			const underTen = birthDate.isSameOrAfter(tenYearsAgo, "day");
			if (!underTen) throw new Error(`Sorry, you are too old now!`);
			req.user = user;
			req.profile = profile;
		}),
	body("wishlist").notEmpty().escape(),
	(req: Request<undefined, undefined, wishListForm>, res: Response) => {
		const result = validationResult(req);
		if (!result.isEmpty()) return res.status(422).json({ errors: result.array() });
		// Does the user already have a pending wish?
		const existingWish = database.pendingWishes.find(wish => wish.username === req.user.username);
		if (existingWish)
			return res.status(409).json({ errors: [{ path: "wishlist", msg: "You already have a wish pending!" }] });
		const body = matchedData<wishListForm>(req);
		const wish: wish = { username: req.user.username, address: req.profile.address, list: body.wishlist };
		database.pendingWishes.push(wish);
		return res.json(body.username);
	},
);

export default router;
