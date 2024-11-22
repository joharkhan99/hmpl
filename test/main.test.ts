import nock from "nock";
import "./setup";
import "./server.setup";
import { strict as assert } from "assert";
import { compile, stringify } from "../src/main";
import {
  AUTO_BODY,
  checkFunction,
  COMPILE_ERROR,
  FORM_DATA,
  ID,
  INDICATORS,
  MEMO,
  METHOD,
  MODE,
  PARSE_ERROR,
  RENDER_ERROR,
  REQUEST_OBJECT_ERROR,
  SOURCE
} from "./config";
import { HMPLRequestInfo } from "../src/types";

/**
 * Function "compile"
 */

const baseUrl = "https://hmpl-lang.dev";

const createScope = (
  code: number = 200,
  template: string = "<div>123</div>",
  route: string = "/api/test"
) => {
  return nock(baseUrl).get(route).reply(code, template);
};

const clearScope = (scope: nock.Scope) => {
  assert.strictEqual(scope.isDone(), true, "Not all requests were completed");
  nock.cleanAll();
};

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
  options: any = {}
) => {
  it("", async () => {
    const scope = createScope();
    const req = await new Promise((res) => {
      compile(template)({
        ...options,
        get: (...args) => get(res, ...args)
      });
    });
    assert.deepEqual(req, true);
    clearScope(scope);
  });
};

const createTestObj1 = (obj: Record<string, any>) => {
  return `<div>{${stringify(obj as HMPLRequestInfo)}}</div>`;
};

const createTestObj2 = (text: string) => {
  return `<div>${text}</div>`;
};

describe("compile function", () => {
  e(
    "",
    () => compile(123 as any),
    `${COMPILE_ERROR}: Template was not found or the type of the passed value is not string`
  );

  e(
    "",
    () => compile(""),
    `${COMPILE_ERROR}: Template must not be a falsey value`
  );

  e(
    "",
    () => compile("some template", "some text" as any),
    `${COMPILE_ERROR}: Options must be an object`
  );

  e(
    "",
    () => compile("some template", { memo: 123 as unknown as boolean }),
    `${REQUEST_OBJECT_ERROR}: The value of the property ${MEMO} must be a boolean value`
  );

  e("", () => compile("<div></div>"), `${PARSE_ERROR}: Request not found`);

  e(
    "",
    () => compile(createTestObj1({ a: "" })),
    `${REQUEST_OBJECT_ERROR}: Property "a" is not processed`
  );

  e(
    "",
    () => compile(createTestObj1({ [INDICATORS]: "" })),
    `${REQUEST_OBJECT_ERROR}: The value of the property "${INDICATORS}" must be an array`
  );

  e(
    "",
    () => compile(createTestObj1({ [ID]: [] })),
    `${REQUEST_OBJECT_ERROR}: The value of the property "${ID}" must be a string`
  );

  e(
    "",
    () => compile(createTestObj1({ [MEMO]: [] })),
    `${REQUEST_OBJECT_ERROR}: The value of the property "${MEMO}" must be a boolean value`
  );

  e(
    "",
    () => compile(createTestObj1({ [MODE]: [] })),
    `${REQUEST_OBJECT_ERROR}: The value of the property "${MODE}" must be a boolean value`
  );

  e(
    "",
    () => compile(createTestObj1({ [AUTO_BODY]: [] })),
    `${REQUEST_OBJECT_ERROR}: Expected a boolean or object, but got neither`
  );

  e(
    "",
    () => compile(createTestObj1({ [AUTO_BODY]: { a: "" } })),
    `${REQUEST_OBJECT_ERROR}: Unexpected property "a"`
  );

  e(
    "",
    () => compile(createTestObj1({ [AUTO_BODY]: { [FORM_DATA]: "" } })),
    `${REQUEST_OBJECT_ERROR}: The "${FORM_DATA}" property should be a boolean`
  );

  e(
    "",
    () => compile(createTestObj1({ [SOURCE]: [] })),
    `${REQUEST_OBJECT_ERROR}: The value of the property "${SOURCE}" must be a string`
  );

  e(
    "",
    () => compile(createTestObj1({ [SOURCE]: [] })),
    `${REQUEST_OBJECT_ERROR}: The value of the property "${SOURCE}" must be a string`
  );

  e(
    "",
    () => compile(createTestObj2(`{{ "src":"/api/test" }e}}`)),
    `${PARSE_ERROR}: There is no empty space between the curly brackets`
  );

  e(
    "",
    () =>
      compile(
        createTestObj2(`{{ "src":"/api/test", "indicators":{"property":{}}}`)
      ),
    `${PARSE_ERROR}: There is no empty space between the curly brackets`
  );

  e(
    "",
    () => compile(`${createTestObj2(`{{ "src":"/api/test" }}`)}<div></div>`),
    `${RENDER_ERROR}: Template include only one node with type Element or Comment`
  );

  eq(
    "",
    checkFunction(compile(createTestObj2(`{{ "src":"/api/test" }}`))),
    true
  );
});

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

/**
 * Template function
 */

describe("template function", () => {
  e(
    "",
    () =>
      compile(
        createTestObj2(
          `<button>Click</button>{{ "src":"/api/test", "method": "test", "after": "click:#increment" }}`
        )
      )(),
    `${REQUEST_OBJECT_ERROR}: The "${METHOD}" property has only GET, POST, PUT, PATCH or DELETE values`
  );
  e(
    "",
    () => compile(`{{ "src":"/api/test", "after": "click:#increment" }}`)(),
    `${RENDER_ERROR}: EventTarget is undefined`
  );
  e(
    "",
    () => compile(`{{ "src":"/api/test", "memo": true }}`)(),
    `${REQUEST_OBJECT_ERROR}: Memoization works in the enabled repetition mode`
  );
  e(
    "",
    () =>
      compile(
        createTestObj2(
          `<button>Click</button>{{ "src":"/api/test", "after": "click:#increment", "memo": true, "repeat": false }}`
        )
      )(),
    `${REQUEST_OBJECT_ERROR}: Memoization works in the enabled repetition mode`
  );
  e(
    "",
    () =>
      compile(
        createTestObj2(
          `<button>Click</button>{{ "src":"/api/test", "after":"click:#increment" }}`
        )
      )(),
    `${RENDER_ERROR}: Selectors nodes not found`
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<button id="increment">Click</button>{{ "src":"/api/test", "after":"click:#increment" }}`
      ),
      { memo: true }
    )().response?.outerHTML,
    '<div><button id="increment">Click</button><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<button id="increment">Click</button>{{ "src":"/api/test", "after":"click:#increment", "repeat": false }}`
      ),
      { memo: true }
    )().response?.outerHTML,
    '<div><button id="increment">Click</button><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<button id="increment">Click</button>{{ "src":"/api/test", "after":"click:#increment", "memo": true }}`
      ),
      { memo: false }
    )().response?.outerHTML,
    '<div><button id="increment">Click</button><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<button id="increment">Click</button>{{ "src":"/api/test", "after":"click:#increment", "memo": true }}`
      ),
      { memo: false }
    )().response?.outerHTML,
    '<div><button id="increment">Click</button><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<button id="increment">Click</button>{{ "src":"/api/test", "after":"click:#increment", "memo": false }}`
      ),
      { memo: true }
    )().response?.outerHTML,
    '<div><button id="increment">Click</button><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(createTestObj2(`{{ "src":"${baseUrl}/api/test" }}`))().response
      ?.outerHTML,
    "<div><!--hmpl0--></div>"
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<button id="increment">Click</button>{{ "src":"/api/test", "after":"click:#increment" }}`
      )
    )().response?.outerHTML,
    '<div><button id="increment">Click</button><!--hmpl0--></div>'
  );
  aeq(
    createTestObj2(`{{ "src":"${baseUrl}/api/test" }}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value?.outerHTML === `<div><div>123</div></div>`) {
            res(true);
          } else {
            res(false);
          }
          break;
      }
    }
  );
  const aeq0 = stringify({
    src: `${baseUrl}/api/test`,
    indicators: [
      {
        trigger: "pending",
        content: "<p>Loading...</p>"
      }
    ]
  });
  aeq(createTestObj2(`{${aeq0}}`), (res, prop, value) => {
    switch (prop) {
      case "response":
        if (value?.outerHTML === `<div><p>Loading...</p></div>`) {
          res(true);
        } else {
          res(false);
        }
        break;
    }
  });
  aeq(
    createTestObj2(`{${aeq0}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value?.outerHTML === `<div><p>Loading...</p></div>`) {
            res(true);
          } else {
            res(false);
          }
          break;
      }
    },
    {
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      timeout: 4000,
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: {
        "Cache-Control": "no-cache"
      }
    }
  );
});
