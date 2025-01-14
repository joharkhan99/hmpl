import assert from "assert";
import sinon from "sinon";
import { createWarning } from "../../src/main";

describe("createWarning", () => {
  it("", () => {
    const consoleWarnSpy = sinon.spy(console, "warn");
    const warningText = "This is a test warning";
    createWarning(warningText);
    assert.strictEqual(consoleWarnSpy.calledOnce, true);
    assert.strictEqual(consoleWarnSpy.calledWith(warningText), true);
    consoleWarnSpy.restore();
  });
});
