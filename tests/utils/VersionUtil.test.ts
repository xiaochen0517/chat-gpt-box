import {describe, expect, it} from "vitest";
import VersionUtil from "../../src/utils/VersionUtil";

describe("VersionUtil", () => {
  it("returns true when current version is less than latest version", () => {
    expect(VersionUtil.compareVersion("1.0.0", "1.0.1")).toBe(true);
  });

  it("returns false when current version is equal to latest version", () => {
    expect(VersionUtil.compareVersion("1.0.0", "1.0.0")).toBe(false);
  });

  it("returns false when current version is greater than latest version", () => {
    expect(VersionUtil.compareVersion("1.0.1", "1.0.0")).toBe(false);
  });

  it("returns false when current version is greater than latest version with v", () => {
    expect(VersionUtil.compareVersion("1.0.1", "v1.0.0")).toBe(false);
  });

  it("handles versions with different lengths correctly", () => {
    expect(VersionUtil.compareVersion("1.0", "1.0.1")).toBe(true);
    expect(VersionUtil.compareVersion("1.0.1", "1.0")).toBe(false);
  });

  it("ignores leading \"v\" or \"V\" in versions", () => {
    expect(VersionUtil.compareVersion("v1.0.0", "1.0.1")).toBe(true);
    expect(VersionUtil.compareVersion("V1.0.0", "1.0.1")).toBe(true);
  });

  it("handles non-numeric characters in versions", () => {
    expect(VersionUtil.compareVersion("1.0.0-alpha", "1.0.1")).toBe(true);
    expect(VersionUtil.compareVersion("1.0.1-beta", "1.0.0")).toBe(false);
  });

  it("returns false when both versions are empty", () => {
    expect(VersionUtil.compareVersion("", "")).toBe(false);
  });

  it("returns true when current version is empty and latest version is not", () => {
    expect(VersionUtil.compareVersion("", "1.0.0")).toBe(true);
  });

  it("returns false when latest version is empty and current version is not", () => {
    expect(VersionUtil.compareVersion("1.0.0", "")).toBe(false);
  });
});
