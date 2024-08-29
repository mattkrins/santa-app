import { render, screen } from "../../test-utils";
import React from "react";
import { describe, expect, test } from "vitest";
import "@testing-library/jest-dom";
import App from "../../src/client/components/App";

describe("App Component", () => {
	test("App renders with header", () => {
		render(<App />);
		expect(screen.getByText("A letter to Santa 🎅")).toBeInTheDocument();
	});
});
