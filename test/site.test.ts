import { describe, expect, it } from "vitest";
import { builtPage, readText } from "./site";

describe("built root page", () => {
  const $ = builtPage("index.html");

  it("has one h1 reading THE DNA CASA and the subtitle Dan & Alexis", () => {
    expect($("h1")).toHaveLength(1);
    expect(readText($, "h1")).toBe("THE DNA CASA");
    expect($("p").filter((_, p) => $(p).text().trim() === "Dan & Alexis")).toHaveLength(1);
  });
});
