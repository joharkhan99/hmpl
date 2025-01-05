import nock from "nock";
import {
  RENDER_ERROR,
  REQUEST_OBJECT_ERROR,
  METHOD,
  BASE_URL,
  RESPONSE_ERROR,
  DEFAULT_ALLOWED_CONTENT_TYPES
} from "../config/config";

import { compile, stringify } from "../../src/main";
import {
  e,
  eq,
  eaeq,
  aeq,
  aeqe,
  createTestObj2,
  createTestObj3,
  createTestObj4
} from "./functions";

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
  const contentType1 = "application/octet-stream";
  eaeq(
    createTestObj2(`{{ "src":"${BASE_URL}/api/test" }}`),
    `${RESPONSE_ERROR}: Expected ${DEFAULT_ALLOWED_CONTENT_TYPES.join(
      ", "
    )}, but received ${contentType1}`,
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
    `${RESPONSE_ERROR}: Expected ${DEFAULT_ALLOWED_CONTENT_TYPES.join(
      ", "
    )}, but received `,
    () => ({}) as any,
    {},
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": ""
      }
    }
  );
  aeq(`{{ "src":"${BASE_URL}/api/test" }}`, (res, prop, value) => {
    switch (prop) {
      case "response":
        if (value?.outerHTML === `<template><div>123</div></template>`) {
          res(true);
        } else {
          res(false);
        }
        break;
    }
  });
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
    {},
    {
      template: Buffer.from("<div>123</div>", "utf-8"),
      headers: {
        "Content-Type": "application/octet-stream"
      }
    }
  );

  const aeq0 = stringify({
    src: `${BASE_URL}/api/test`,
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
  aeq(`{${aeq0}}`, (res, prop, value) => {
    switch (prop) {
      case "response":
        if (value?.outerHTML === `<template><div>123</div></template>`) {
          res(true);
        }
        break;
    }
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
  const aeq5 = stringify({
    src: `${BASE_URL}/api/test`,
    indicators: [
      {
        trigger: "error",
        content: "<p>405</p>"
      }
    ]
  });
  aeq(
    `{${aeq5}}`,
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
  // const aeq6 = stringify({
  //   src: `${BASE_URL}/api/test`,
  //   indicators: [
  //     {
  //       trigger: 300,
  //       content: "<p>405</p>"
  //     }
  //   ]
  // });
  // eaeq(
  //   createTestObj2(`{${aeq6}}`),
  //   (res, prop, value) => {
  //     switch (prop) {
  //       case "response":
  //         console.log(value?.outerHTML);
  //         if (value?.outerHTML === `<template><p>405</p></template>`) {
  //           res(true);
  //         }
  //         break;
  //     }
  //   },
  //   {},
  //   {
  //     code: 405
  //   }
  // );
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
      signal: new AbortController().signal,
      referrerPolicy: "no-referrer",
      headers: {
        "Cache-Control": "no-cache"
      }
    }
  );
  const aeq1 = stringify({
    src: `${BASE_URL}/api/test`,
    after: "click:#click"
  });
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
  const aeqe0 = stringify({
    src: `${BASE_URL}/api/test`,
    after: "click:#click",
    initId: "1"
  });
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
      memo: true,
      timeout: 1000
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
  const aeq3 = stringify({
    src: `${BASE_URL}/api/getFormComponent`,
    after: "submit:#form",
    method: "post"
  });
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
    nock.cleanAll();
  });
});
