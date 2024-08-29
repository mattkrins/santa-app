import { fireEvent, render, screen, waitFor } from "../../test-utils";
import React from "react";
import { describe, expect, test, vi } from "vitest";
import "@testing-library/jest-dom";
import WishList from "../../src/client/components/WishList";

describe("wishList component", () => {
	test("form renders with all fields", () => {
		render(<WishList />);
		expect(screen.getByText("Ho ho ho, what would you like for Christmas? 🎁")).toBeInTheDocument();
		expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/wish list/i)).toBeInTheDocument();
		expect(screen.getByText(/send letter/i)).toBeInTheDocument();
	});
	test("shows validation errors on empty submit", async () => {
		render(<WishList />);
		fireEvent.click(screen.getByText(/send letter/i));
		await waitFor(() => {
			expect(screen.getByText(/That does not look like a valid username!/i)).toBeInTheDocument();
			expect(screen.getByText(/Santa needs to know what you want!/i)).toBeInTheDocument();
		});
	});
	test("shows validation error for invalid username", async () => {
		render(<WishList />);
		fireEvent.input(screen.getByLabelText(/username/i), { target: { value: "invalidusername" } });
		fireEvent.click(screen.getByText(/send letter/i));
		await waitFor(() => {
			expect(screen.getByText(/That does not look like a valid username!/i)).toBeInTheDocument();
		});
	});
	test("submits the form successfully", async () => {
		vi.mock("../../src/client/hooks/useFetch", () => ({
			__esModule: true,
			default: () => ({
				data: "charlie.brown",
				error: null,
				errors: null,
				loading: false,
				post: vi.fn(),
			}),
		}));
		render(<WishList />);
		fireEvent.input(screen.getByLabelText(/username/i), { target: { value: "charlie.brown" } });
		fireEvent.input(screen.getByLabelText(/wish list/i), { target: { value: "I want a football" } });
		fireEvent.click(screen.getByText(/send letter/i));
		await waitFor(() => {
			expect(screen.getByText(/charlie.brown/i)).toBeInTheDocument();
		});
	});
});
