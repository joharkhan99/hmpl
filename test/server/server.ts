import nock from "nock";
import { BASE_URL } from "../config/config";
import { strict as assert } from "assert";
import type { ScopeOptions } from "../core/functions.types";

const createScope = ({
  code = 200,
  afterCode = 405,
  template = "<div>123</div>",
  route = "/api/test",
  method = "get",
  times = 999,
  isAfter = false,
  headers = {
    "Content-Type": "text/html"
  }
}: ScopeOptions) => {
  let callCount = 0;

  return nock(BASE_URL)
    .persist()
    [method](route)
    .reply(() => {
      if (isAfter) {
        callCount++;
        if (callCount <= times) {
          return [code, template, headers];
        } else {
          return [afterCode, "", headers];
        }
      } else {
        return [code, template, headers];
      }
    });
};

const clearScope = (scope: nock.Scope) => {
  assert.strictEqual(scope.isDone(), true, "Not all requests were completed");
  nock.cleanAll();
};

export { createScope, clearScope };
