import { eq } from "./functions";
import { stringify } from "../../src/main";

/**
 * Function "stringify"
 */

describe("stringify function", () => {
  eq(
    "",
    stringify({ src: "/api/test", method: "GET" }),
    '{"src":"/api/test","method":"GET"}'
  );
});
