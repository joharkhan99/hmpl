import assert from "assert";
import sinon from "sinon";
import { createWarning } from "../../src/main";

describe("createWarning", () => {
  it("should log a warning to the console", () => {
    const consoleWarnSpy = sinon.spy(console, "warn");
    const warningText = "This is a test warning";
    createWarning(warningText);
    assert.strictEqual(consoleWarnSpy.calledOnce, true);
    assert.strictEqual(consoleWarnSpy.calledWith(warningText), true);
    consoleWarnSpy.restore();
  });
});
