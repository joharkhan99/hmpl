import nock from "nock";
import {
  RENDER_ERROR,
  REQUEST_OBJECT_ERROR,
  METHOD,
  BASE_URL,
  RESPONSE_ERROR,
  DEFAULT_ALLOWED_CONTENT_TYPES,
  REQUEST_INIT_ERROR,
  REQUEST_INIT_GET
} from "../config/config";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
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

const eaeq1 = stringify({
  src: `${BASE_URL}/api/test`,
  initId: "1"
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

const aeq8 = stringify({
  src: `${BASE_URL}/api/test`,
  after: "click:#click",
  repeat: false
});

const aeqe0 = stringify({
  src: `${BASE_URL}/api/test`,
  after: "click:#click",
  initId: "1"
});

const contentType1 = "application/octet-stream";

describe("template function", () => {
  e(
    `only accepts the '${METHOD}' property in the REQUEST OBJECT as GET, POST, PUT, PATCH or DELETE`,
    () =>
      compile(
        createTestObj2(
          `<button>Click</button>{{ "src":"/api/test", "method": "test", "after": "click:#increment" }}`
        )
      )(),
    `${REQUEST_OBJECT_ERROR}: The "${METHOD}" property has only GET, POST, PUT, PATCH or DELETE values`
  );
  e(
    "throws an error if the EVENT TARGET doesn't exist",
    () => compile(`{{ "src":"/api/test", "after": "click:#increment" }}`)(),
    `${RENDER_ERROR}: EventTarget is undefined`
  );
  e(
    "throws an error if Memoization enabled without the Repetition mode enabled",
    () => compile(`{{ "src":"/api/test", "memo": true }}`)(),
    `${REQUEST_OBJECT_ERROR}: Memoization works in the enabled repetition mode`
  );
  e(
    `throws an error if the '${REQUEST_INIT_GET}' property in the RequestInit object is a function`,
    () => compile(createTestObj2(`{{ "src":"123" }}`))({ get: "" as any }),
    `${REQUEST_INIT_ERROR}: The "${REQUEST_INIT_GET}" property has a function value`
  );
  e(
    "throws an error if the value being passed is a number for RequestInit",
    () =>
      compile(createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`))(123 as any),
    `${REQUEST_INIT_ERROR}: The type of the value being passed does not match the supported types for RequestInit`
  );
  e(
    "throws an error if passed duplicate IDs for the RequestInit objects",
    () =>
      compile(createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`))([
        { id: "1", value: {} },
        { id: "1", value: {} }
      ]),
    `${REQUEST_INIT_ERROR}: ID with value "1" already exists`
  );
  e(
    "",
    () =>
      compile(createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`))([
        { id: 1, value: {} },
        { id: 1, value: {} }
      ]),
    `${REQUEST_INIT_ERROR}: ID with value 1 already exists`
  );
  e(
    "throws an error if the ID is not a string or a number",
    () =>
      compile(createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`))([
        { id: [] as any, value: {} },
        { id: 1, value: {} }
      ]),
    `${REQUEST_INIT_ERROR}: ID must be a string or a number`
  );
  e(
    "throws an error if the value is not an object for RequestInit object",
    () =>
      compile(createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`))([
        "123" as any,
        { id: 1, value: {} }
      ]),
    `${REQUEST_INIT_ERROR}: IdentificationRequestInit is of type object`
  );
  e(
    "throws an error if the ID or value is not present for RequestInit object",
    () =>
      compile(createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`))([
        {} as any,
        { id: 1, value: {} }
      ]),
    `${REQUEST_INIT_ERROR}: Missing "id" or "value" property`
  );
  e(
    "throws an error if Memoization enabled without the Repetition mode enabled",
    () =>
      compile(
        createTestObj2(
          `<button>Click</button>{{ "src":"/api/test", "after": "click:#increment", "memo": true, "repeat": false }}`
        )
      )(),
    `${REQUEST_OBJECT_ERROR}: Memoization works in the enabled repetition mode`
  );
  e(
    "throws an error if the selector nodes are not found",
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
    "throws an error if passed duplicate indicator triggers",
    () => compile(createTestObj2(`{${eq0}}`))(),
    `${REQUEST_OBJECT_ERROR}: Indicator trigger must be unique`
  );
  e(
    "throws an error if provided an invalid indicator trigger",
    () => compile(createTestObj2(`{${eq1}}`))(),
    `${REQUEST_OBJECT_ERROR}: Failed to activate or detect the indicator`
  );
  e(
    "throws an error if trigger is not provided to the indicators",
    () => compile(createTestObj2(`{${eq2}}`))(),
    `${REQUEST_OBJECT_ERROR}: Failed to activate or detect the indicator`
  );
  e(
    "throws an error if trigger is a number and the value is not provided to the indicators",
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
    `${REQUEST_INIT_ERROR}: Expected an object with initialization options`,
    () => ({}) as any,
    () => () => 1 as any,
    {}
  );
  eaeq(
    createTestObj2(
      `{{ "src":"${BASE_URL}/api/test" }}{{ "src":"${BASE_URL}/api/test" }}`
    ),
    `${REQUEST_INIT_ERROR}: Expected an object with initialization options`,
    () => ({}) as any,
    () => () => 1 as any,
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
  eaeq(
    createTestObj2(`{${eaeq1}}`),
    `${REQUEST_OBJECT_ERROR}: ID referenced by request not found`,
    () => ({}) as any,
    (res: any) => [
      {
        id: "2",
        value: {}
      }
    ],
    {}
  );
  eaeq(
    createTestObj2(`{${eaeq1}}`),
    `${REQUEST_OBJECT_ERROR}: ID referenced by request not found`,
    () => ({}) as any,
    (res: any) => [
      {
        id: "2",
        value: {}
      }
    ],
    {}
  );
  eaeq(
    createTestObj2(`{${eaeq1}}`),
    `${REQUEST_OBJECT_ERROR}: ID referenced by request not found`,
    () => ({}) as any,
    (res: any) => ({}),
    {}
  );
  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test", initId:"" }}`),
    () => ({}),
    (res: any) => [
      {
        id: "2",
        value: {}
      }
    ],
    undefined,
    undefined,
    true
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
    createTestObj2(`{{ src: "${BASE_URL}/api/test" }}`),
    (res, prop, value) => {
      switch (prop) {
        case "status":
          if (value === "rejected") {
            res(true);
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
        case "status":
          if (value === "rejected") {
            res(true);
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
    createTestObj2(`{{ src: "${BASE_URL}/api/test", indicators:[] }}`),
    (res, prop, value) => {
      switch (prop) {
        case "status":
          if (value === 100) {
            res(true);
          }
          break;
      }
    },
    {},
    {
      code: 100
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
  waeq(
    `{{ "src":"${BASE_URL}/api/test" }}`,
    `${REQUEST_INIT_ERROR}: The "keepalive" property is not yet supported`,
    () => ({}) as any,
    {
      keepalive: true
    },
    {}
  );
  aeq(
    createTestObj2(
      `{{ "src":"${BASE_URL}/api/test", disallowedTags:["script"] }}`
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
      template: "<div>123</div><script></script>"
    }
  );
  aeq(
    createTestObj2(
      `{{ "src":"${BASE_URL}/api/test", disallowedTags:["script"] }}`
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
      template: "<div>123</div><script></script>"
    },
    {
      disallowedTags: ["style"]
    }
  );
  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test", sanitize:true }}`),
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
    },
    {}
  );
  aeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test", sanitize:true }}`),
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
    },
    {
      sanitize: false
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
    createTestObj2(
      `{{ "src":"${BASE_URL}/api/test" }}{{ "src":"${BASE_URL}/api/test" }}`
    ),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (value?.outerHTML === `<div><div>123</div><div>123</div></div>`) {
            res(true);
          }
          break;
      }
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
  aeqe(
    `<pre><button id="click">click</button>{${aeq1}}</pre>`,
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<pre><button id="click">click</button><div>123</div></pre>`
          ) {
            res(true);
          } else {
            res(false);
          }
          break;
      }
    }
  );
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

  aeqe(
    createTestObj3(`{${aeq8}}{${aeq8}}`),
    (res, prop, value) => {
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
    },
    {},
    {},
    {},
    1
  );

  aeqe(
    createTestObj3(`<pre>{${aeq8}}</pre>`),
    (res, prop, value) => {
      switch (prop) {
        case "response":
          if (
            value?.outerHTML ===
            `<div><button id="click">click</button><pre><pre>123</pre></pre></div>`
          ) {
            res(true);
          }
          break;
      }
    },
    {},
    {},
    {
      template: "<pre>123</pre>"
    },
    1
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
  // status templateObject check
  aeqe(
    createTestObj3(`{${aeq1}}`),
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
      isAfter: true,
      afterCode: 200,
      afterHeaders: {
        "Content-Type": contentType1
      },
      times: 1
    },
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
    {},
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
