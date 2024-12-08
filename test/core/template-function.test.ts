import {
  RENDER_ERROR,
  REQUEST_OBJECT_ERROR,
  METHOD,
  BASE_URL
} from "../config/config";

import { compile, stringify } from "../../src/main";
import {
  e,
  eq,
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
});
