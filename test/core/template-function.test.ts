import {
  RENDER_ERROR,
  REQUEST_OBJECT_ERROR,
  METHOD,
  BASE_URL
} from "../config/config";

import { compile, stringify } from "../../src/main";
import { e, eq, aeq, createTestObj2 } from "./functions";

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
  eq(
    "",
    compile(
      createTestObj2(
        `<button id="increment">Click</button>{{ "src":"/api/test", "after":"click:#increment" }}`
      )
    )({
      keepalive: true
    } as any).response?.outerHTML,
    '<div><button id="increment">Click</button><!--hmpl0--></div>'
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
  //   aeq(
  //     createTestObj2(
  //       `<button id="increment">Click</button>{{ "src":"${BASE_URL}/api/test", "after":"click:#increment", "memo": true }}`
  //     ),
  //     (res, prop, value) => {
  //       switch (prop) {
  //         case "response":
  //           if (value?.outerHTML === `<div><div>123</div></div>`) {
  //             res(true);
  //           } else {
  //             res(false);
  //           }
  //           break;
  //       }
  //     }
  //   );
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
});
