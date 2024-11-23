import "../setup/setup";
import "../setup/server.setup";
import { strict as assert } from "assert";
import { HMPLRequestInfo } from "../../src/types";
import { createScope, clearScope } from "../server/server";
import { compile, stringify } from "../../src/main";
import type { ScopeOptions } from "./functions.types";

const e = (text: string, block: () => unknown, message: string) => {
  it(text, () => {
    assert.throws(block, {
      message
    });
  });
};

const eq = (text: string, block: unknown, equality: any) => {
  it(text, () => {
    assert.strictEqual(block, equality);
  });
};

const aeq = (
  template: string,
  get: (...args: any[]) => void,
  options: any = {},
  scopeOptions: ScopeOptions = {}
) => {
  it("", async () => {
    const scope = createScope({ ...scopeOptions });
    const req = await new Promise((res) => {
      compile(template)({
        get: (...args) => get(res, ...args),
        ...options
      });
    });
    assert.deepEqual(req, true);
    clearScope(scope);
  });
};

const ae = (
  template: string,
  message: string,
  get: (...args: any[]) => void,
  options: any = {},
  scopeOptions: ScopeOptions = {}
) => {
  it("", async () => {
    const scope = createScope({ ...scopeOptions });
    assert.throws(
      async () => {
        await new Promise((res) => {
          compile(template)({
            get: (...args) => get(res, ...args),
            ...options
          });
        });
      },
      {
        message
      }
    );
    clearScope(scope);
  });
};

const createTestObj1 = (obj: Record<string, any>) => {
  return `<div>{${stringify(obj as HMPLRequestInfo)}}</div>`;
};

const createTestObj2 = (text: string) => {
  return `<div>${text}</div>`;
};

export { e, eq, ae, aeq, createTestObj1, createTestObj2 };
