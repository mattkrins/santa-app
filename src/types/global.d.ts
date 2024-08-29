/**
 * Contains form data for a user submitted wish.
 */
interface wishListForm {
	/** @type {string}: Username for the submission. */
	username: string;
	/** @type {string}: Wish list for the submission. */
	wishlist: string;
}

/**
 * Contains a user's login username and unique id.
 */
interface user {
	/** @type {string}: The user's login username.
	 ** Example: john.smith */
	username: string;
	/** @type {string}: The user's unique id.
	 ** Example: 710b0800-72c7-11e9-a923-1281be663d3x */
	uid: string;
}

/**
 * Contains a user's unique id, street address and birth date.
 */
interface profile {
	/** @type {string}: The user's unique ID.
	 ** Example: 710b0800-72c7-11e9-a923-1281be663d3x */
	userUid: string;
	/** @type {string}: The user's street address.
	 ** Example: 123 Fake st, Shinbashi, Toyko */
	address: string;
	/** @type {string}: The user's date of birth.
	 ** Example: 2001/22/12 */
	birthdate: string;
}

/**
 * Contains a user's login username, street address and wish list.
 */
interface wish {
	username: string;
	address: string;
	list: string;
}

/**
 * Project database:
 ** users: Array of users.
 ** profiles: Array of user profiles.
 ** pendingWishes: Array of pending user wishes.
 */
interface database {
	users: user[];
	profiles: profile[];
	pendingWishes: wish[];
}

// Extend the express namespace so requests can have a user attached.
declare namespace Express {
	export interface Request {
		user: user;
		profile: profile;
	}
}
