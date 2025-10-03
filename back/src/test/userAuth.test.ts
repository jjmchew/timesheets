import { describe, expect, test } from "vitest";
import { hashPassword, comparePassword } from "../utils/userAuth.js";

describe("userAuth.js", () => {
  test("comparePassword correctly identifies SAME stored PW (hashPassword)", async () => {
    const SUPPLIED_PW = "pizza";
    const storedPW = hashPassword(SUPPLIED_PW);
    const compare = comparePassword(storedPW, SUPPLIED_PW);
    expect(compare).toBe(true);
  });

  test("comparePassword correctly identifies DIFFERENT stored PW (hashPassword)", async () => {
    const SUPPLIED_PW = "pizza";
    const STORED_PW = "pizzanova";
    const storedPW = hashPassword(STORED_PW);
    const compare = comparePassword(storedPW, SUPPLIED_PW);
    expect(compare).toBe(false);
  });
});
