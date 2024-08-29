import axios from "axios";

const axiosClient = axios.create({
	baseURL: "https://raw.githubusercontent.com/alj-devops/santa-data/master/",
	headers: { "Content-Type": "application/json" },
});

/**
 * Project database:
 ** users: Array of users.
 ** profiles: Array of user profiles.
 ** pendingWishes: Array of pending user wishes.
 */
export const database: database = {
	users: [],
	profiles: [],
	pendingWishes: [],
};

/**
 * Retrieves user and profile json from github endpoint.\
 * Stores records in an in-memory database.
 **/
export default async function initDatabase() {
	try {
		const users = await axiosClient.get<user[]>("users.json");
		const profiles = await axiosClient.get<profile[]>("userProfiles.json");
		database.users = users.data;
		database.profiles = profiles.data;
	} catch (e) {
		console.error("Failed to load database.");
		throw e;
	}
}
