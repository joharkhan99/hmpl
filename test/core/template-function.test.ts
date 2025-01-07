import nock from "nock";
import {
  RENDER_ERROR,
  REQUEST_OBJECT_ERROR,
  METHOD,
  BASE_URL,
  RESPONSE_ERROR,
  DEFAULT_ALLOWED_CONTENT_TYPES,
  REQUEST_INIT_ERROR
} from "../config/config";
import { compile, stringify } from "../../src/main";
import {
  waeq,
  e,
  eq,
  eaeq,
  aeq,
  aeqe,
  createTestObj2,
  createTestObj3,
  createTestObj4
} from "./functions";
import sinon from "sinon";

/**
 * Template function
 */
const eq0 = stringify({
  src: `${BASE_URL}/api/test`,
  indicators: [
    {
      trigger: "pending",
      content: "<p>Loading...</p>"
    },
    {
      trigger: "pending",
      content: "<p>Loading...</p>"
    }
  ]
});

const eq1 = stringify({
  src: `${BASE_URL}/api/test`,
  indicators: [
    {
      trigger: 123 as any,
      content: "<p>Loading...</p>"
    }
  ]
});

const eq2 = stringify({
  src: `${BASE_URL}/api/test`,
  indicators: [
    {
      content: "<p>Loading...</p>"
    } as any
  ]
});

const eq3 = stringify({
  src: `${BASE_URL}/api/test`,
  indicators: [
    {
      trigger: 100 as any
    } as any
  ]
});

const aeq0 = stringify({
  src: `${BASE_URL}/api/test`,
  indicators: [
    {
      trigger: "pending",
      content: "<p>Loading...</p>"
    }
  ]
});

const aeq1 = stringify({
  src: `${BASE_URL}/api/test`,
  after: "click:#click"
});

const aeq2 = stringify({
  src: `${BASE_URL}/api/test`,
  after: "click:#click",
  indicators: [
    {
      trigger: "pending",
      content: "<p>Loading...</p>"
    }
  ]
});

const aeq3 = stringify({
  src: `${BASE_URL}/api/getFormComponent`,
  after: "submit:#form",
  method: "post"
});

const aeq4 = stringify({
  src: `${BASE_URL}/api/test`,
  indicators: [
    {
      trigger: 405,
      content: "<p>405</p>"
    }
  ]
});

const aeq5 = stringify({
  src: `${BASE_URL}/api/test`,
  indicators: [
    {
      trigger: "error",
      content: "<p>Error</p>"
    }
  ]
});

const aeq6 = stringify({
  src: `${BASE_URL}/api/test`,
  indicators: [
    {
      trigger: "rejected",
      content: "<p>Rejected</p>"
    }
  ]
});

const aeq7 = stringify({
  src: `${BASE_URL}/api/test`,
  indicators: [
    {
      trigger: 100,
      content: "<p>100</p>"
    }
  ]
});

const aeqe0 = stringify({
  src: `${BASE_URL}/api/test`,
  after: "click:#click",
  initId: "1"
});

const contentType1 = "application/octet-stream";

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
  e(
    "",
    () => compile(createTestObj2(`{${eq0}}`))(),
    `${REQUEST_OBJECT_ERROR}: Indicator trigger must be unique`
  );
  e(
    "",
    () => compile(createTestObj2(`{${eq1}}`))(),
    `${REQUEST_OBJECT_ERROR}: Failed to activate or detect the indicator`
  );
  e(
    "",
    () => compile(createTestObj2(`{${eq2}}`))(),
    `${REQUEST_OBJECT_ERROR}: Failed to activate or detect the indicator`
  );
  e(
    "",
    () => compile(createTestObj2(`{${eq3}}`))(),
    `${REQUEST_OBJECT_ERROR}: Failed to activate or detect the indicator`
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
    compile(createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`))().response
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
  eaeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
    `${RESPONSE_ERROR}: Expected ${DEFAULT_ALLOWED_CONTENT_TYPES.map(
      (type) => `"${type}"`
    ).join(", ")}, but received "${contentType1}"`,
    () => ({}) as any,
    {},
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": contentType1
      }
    }
  );
  eaeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
    `${RESPONSE_ERROR}: Expected ${DEFAULT_ALLOWED_CONTENT_TYPES.map(
      (type) => `"${type}"`
    ).join(", ")}, but received ""`,
    () => ({}) as any,
    {},
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": ""
      }
    }
  );
  eaeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
    `${REQUEST_INIT_ERROR}: Expected type string, but received type object`,
    () => ({}) as any,
    {
      headers: {
        a: {}
      }
    },
    {}
  );
  eaeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
    `${REQUEST_INIT_ERROR}: The "headers" property must contain a value object`,
    () => ({}) as any,
    {
      headers: []
    },
    {}
  );
  aeq(
    `{{ "src":"${BASE_URL}/api/test" }}`,
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value?.outerHTML === `<template><div>123</div></template>`) {
            res(true);
          } else {
            res(false);
          }
          break;
      }
    },
    {}
  );
  aeq(
    createTestObj2(`{${aeq5}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value?.outerHTML === `<div><p>Error</p></div>`) {
            res(true);
          } else {
            res(false);
          }
          break;
      }
    },
    {},
    {
      isRejected: true
    }
  );
  aeq(
    createTestObj2(`{${aeq6}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value?.outerHTML === `<div><p>Rejected</p></div>`) {
            res(true);
          } else {
            res(false);
          }
          break;
      }
    },
    {},
    {
      isRejected: true
    }
  );
  aeq(
    createTestObj2(`{${aeq7}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value?.outerHTML === `<div><p>100</p></div>`) {
            res(true);
          } else {
            res(false);
          }
          break;
      }
    },
    {},
    {
      code: 100
    }
  );
  // aeq(
  //   createTestObj2(`{${aeq6}}`),
  //   (res, prop, value) => {
  //     switch (prop) {
  //       case "response":
  //         console.log(value?.outerHTML);
  //         if (value?.outerHTML === `<div><!--hmpl0--></div>`) {
  //           res(true);
  //         } else {
  //           res(false);
  //         }
  //         break;
  //     }
  //   },
  //   {},
  //   {
  //     code: 100
  //   }
  // );
  waeq(
    `{{ "src":"${BASE_URL}/api/test" }}`,
    `${REQUEST_INIT_ERROR}: The "signal" property overwrote the AbortSignal from "timeout"`,
    () => ({}) as any,
    {
      timeout: 1000,
      signal: new AbortController().signal
    },
    {}
  );
  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
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
    },
    {},
    {
      template: "<div>123</div><script></script>"
    }
  );
  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
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
    },
    {},
    {},
    {
      memo: true
    }
  );
  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
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
  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test",     indicators: [
      {
        trigger: "pending",
        content: "<p>Loading...</p>"
      }
    ] }}`),
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
    }
  );
  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
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
    },
    {},
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": "application/octet-stream"
      }
    },
    {
      allowedContentTypes: ["application/octet-stream"]
    }
  );

  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
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
    },
    {},
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": "application/octet-stream"
      }
    },
    {
      allowedContentTypes: ["text/html", "application/octet-stream"]
    }
  );

  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
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
    },
    {},
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": "application/octet-stream"
      }
    },
    {
      allowedContentTypes: []
    }
  );

  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
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
    },
    {},
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": "application/octet-stream"
      }
    },
    {
      allowedContentTypes: "*"
    }
  );

  aeq(
    createTestObj2(
      `{{ "src":"${BASE_URL}/api/test", allowedContentTypes: ["application/octet-stream"] }}`
    ),
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
    },
    {},
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": "application/octet-stream"
      }
    },
    {
      allowedContentTypes: ["text/html"]
    }
  );

  aeq(
    createTestObj2(
      `{{ "src":"${BASE_URL}/api/test", allowedContentTypes: ["application/octet-stream"] }}`
    ),
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
    },
    {
      timeout: 1000
    },
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": "application/octet-stream"
      }
    }
  );
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
  aeq(`{${aeq0}}`, (res, prop, value) => {
    switch (prop) {
      case "response":
        if (value?.outerHTML === `<template><div>123</div></template>`) {
          res(true);
        }
        break;
    }
  });
  aeq(
    `{${aeq4}}`,
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value?.outerHTML === `<template><p>405</p></template>`) {
            res(true);
          }
          break;
      }
    },
    {},
    {
      code: 405
    }
  );
  aeq(
    `{${aeq5}}`,
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value?.outerHTML === `<template><p>Error</p></template>`) {
            res(true);
          }
          break;
      }
    },
    {},
    {
      code: 405
    }
  );
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
      integrity: "sha256",
      referrer: "about:client",
      credentials: "same-origin",
      redirect: "follow",
      window: "",
      referrerPolicy: "no-referrer",
      headers: {
        "Cache-Control": "no-cache"
      }
    }
  );
  aeqe(createTestObj3(`{${aeq1}}`), (res, prop, value) => {
    switch (prop) {
      case "response":
        if (
          value?.outerHTML ===
          `<div><button id="click">click</button><div>123</div></div>`
        ) {
          res(true);
        } else {
          res(false);
        }
        break;
    }
  });
  aeqe(
    createTestObj3(`{${aeq1}}`),
    () => ({}),
    {},
    (res: any) => () => {
      return {
        get: (prop: any, value: any) => {
          switch (prop) {
            case "response":
              if (
                value?.outerHTML ===
                `<div><button id="click">click</button><div>123</div></div>`
              ) {
                res(true);
              } else {
                res(false);
              }
              break;
          }
        }
      };
    }
  );
  aeqe(
    createTestObj3(`{${aeqe0}}`),
    () => ({}),
    {},
    (res: any) => [
      {
        id: "1",
        value: {
          get: (prop: any, value: any) => {
            switch (prop) {
              case "response":
                if (
                  value?.outerHTML ===
                  `<div><button id="click">click</button><div>123</div></div>`
                ) {
                  res(true);
                }
                break;
            }
          }
        }
      }
    ]
  );
  aeqe(createTestObj3(`{${aeq1}}{${aeq1}}`), (res, prop, value) => {
    switch (prop) {
      case "response":
        if (
          value?.outerHTML ===
          `<div><button id="click">click</button><div>123</div><div>123</div></div>`
        ) {
          res(true);
        }
        break;
    }
  });
  let memoItem: Element | undefined = undefined;
  aeqe(
    createTestObj3(`{${aeq1}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><div>123</div></div>`
          ) {
            if (!memoItem) {
              memoItem = value;
            } else {
              res(memoItem.childNodes[1] === value.childNodes[1]);
            }
          } else {
            res(false);
          }
          break;
      }
    },
    {
      memo: true
    },
    {},
    {},
    2
  );

  let memoItem1: Element | undefined = undefined;
  aeqe(
    createTestObj3(`{${aeq1}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><div>123</div></div>`
          ) {
            if (!memoItem1) {
              memoItem1 = value;
            } else {
              // this is false
              res(memoItem1.childNodes[1] === value.childNodes[1]);
            }
          } else {
            res(false);
          }
          break;
      }
    },
    {},
    {},
    {},
    2
  );
  let memoItem2: Element | undefined = undefined;
  aeqe(
    createTestObj3(`{${aeq2}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><div>123</div></div>`
          ) {
            if (!memoItem2) {
              memoItem2 = value;
            } else {
              res(memoItem2.childNodes[1] === value.childNodes[1]);
            }
          }
          break;
      }
    },
    {},
    {},
    {},
    2
  );
  let count = 0;
  aeqe(
    createTestObj3(`{${aeq1}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><div>123</div></div>`
          ) {
            if (!memoItem2) {
              if (!count) {
                count++;
              } else {
                memoItem2 = value;
              }
            } else {
              res(true);
            }
          }
          break;
      }
    },
    {},
    {},
    {},
    3
  );
  aeqe(
    createTestObj3(`{${aeq2}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><div>123</div></div>`
          ) {
            if (!memoItem2) {
              memoItem2 = value;
            } else {
              res(memoItem2.childNodes[1] !== value.childNodes[1]);
            }
          }
          break;
      }
    },
    {
      memo: true
    },
    {},
    {},
    2
  );
  aeqe(
    createTestObj3(`{${aeq2}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><div>123</div></div>`
          ) {
            if (!memoItem2) {
              memoItem2 = value;
            } else {
              res(memoItem2.childNodes[1] !== value.childNodes[1]);
            }
          }
          break;
      }
    },
    {
      memo: true
    },
    {},
    {},
    2
  );
  aeqe(
    createTestObj4(`{${aeq3}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><form onsubmit="function prevent(e){e.preventDefault();};return prevent(event);" id="form"></form><div>123</div></div>`
          ) {
            res(true);
          } else {
            res(false);
          }
          break;
      }
    },
    {
      autoBody: true
    },
    {
      keepalive: true
    },
    {
      route: "/api/getFormComponent",
      method: "post"
    },
    1,
    (el) => {
      return el?.getElementsByTagName("form")?.[0];
    },
    "submit"
  );
  aeqe(
    `{${aeq0}}`,
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value === undefined) {
            res(true);
          }
          break;
      }
    },
    {},
    {},
    {
      code: 405
    }
  );
  aeqe(
    createTestObj3(`{${aeq0}}{${aeq0}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><!--hmpl0--><!--hmpl1--></div>`
          ) {
            res(true);
          }
          break;
      }
    },
    {},
    {},
    {
      code: 405,
      times: 1,
      isAfter: true
    },
    2
  );
  aeqe(
    createTestObj3(`{${aeq1}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><div>567</div></div>`
          ) {
            res(true);
          }
          break;
      }
    },
    {
      memo: true
    },
    {},
    {
      afterCode: 200,
      afterTemplate: "<div>567</div>",
      times: 1,
      isAfter: true
    },
    2
  );
  let memoItem3: Element | undefined;
  aeqe(
    createTestObj3(`{${aeq2}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><div>123</div></div>`
          ) {
            if (!memoItem3) {
              memoItem3 = value;
            } else {
              res(memoItem3.childNodes[1] === value.childNodes[1]);
            }
          }
          break;
      }
    },
    {
      memo: true
    },
    {},
    {},
    2,
    undefined,
    undefined,
    {
      timeout: 300
    }
  );
  aeqe(
    createTestObj3(`{${aeq2}}`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><!--hmpl0--></div>`
          ) {
            res(true);
          }
          break;
      }
    },
    {
      memo: true
    },
    {},
    {
      afterCode: 405,
      times: 1,
      isAfter: true
    },
    2
  );
  aeqe(
    `{${aeq0}}`,
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value === undefined) {
            res(true);
          }
          break;
      }
    },
    {},
    {},
    {
      code: 405
    }
  );
  afterEach(() => {
    sinon.restore();
    nock.cleanAll();
  });
});
