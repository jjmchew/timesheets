import assert from "node:assert";
import { hashPassword, comparePassword } from "../utils/userAuth.js";

const SUPPLIED_PW = "pizza";
const storedPW = hashPassword(SUPPLIED_PW);
const compare = comparePassword(storedPW, SUPPLIED_PW);
console.log(storedPW, compare);
assert.equal(compare, true);
