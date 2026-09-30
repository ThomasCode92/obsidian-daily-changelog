import { describe, it, expect } from "vitest";
import DailyChangelogPlugin from "../main";

describe("DailyChangelogPlugin", () => {
  it("should load without throwing", () => {
    const plugin = new DailyChangelogPlugin({} as any, {} as any);

    expect(() => {
      plugin.onload();
    }).not.toThrow();
  });
});
