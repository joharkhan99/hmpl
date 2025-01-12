import {
  AUTO_BODY,
  COMPILE_ERROR,
  FORM_DATA,
  ID,
  INDICATORS,
  MEMO,
  MODE,
  ALLOWED_CONTENT_TYPES,
  PARSE_ERROR,
  RENDER_ERROR,
  REQUEST_OBJECT_ERROR,
  COMPILE_OPTIONS_ERROR,
  SOURCE,
  AFTER
} from "../config/config";

import { checkFunction } from "../shared/utils";
import { compile } from "../../src/main";
import { e, eq, createTestObj1, createTestObj2 } from "./functions";

/**
 * Function "compile"
 */

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
    `${COMPILE_OPTIONS_ERROR}: Options must be an object`
  );
  e(
    "",
    () => compile("some template", { memo: 123 as unknown as boolean }),
    `${COMPILE_OPTIONS_ERROR}: The value of the property ${MEMO} must be a boolean value`
  );

  e("", () => compile("<div></div>"), `${PARSE_ERROR}: Request not found`);

  e(
    "",
    () => compile(createTestObj2(`{{ "repeat":true }}`)),
    `${REQUEST_OBJECT_ERROR}: The "${SOURCE}" property are not found or empty`
  );

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
    () => compile(createTestObj1({ [ALLOWED_CONTENT_TYPES]: {} })),
    `${REQUEST_OBJECT_ERROR}: Expected "*" or string array, but got neither`
  );

  e(
    "",
    () => compile(createTestObj1({ [ALLOWED_CONTENT_TYPES]: [1] })),
    `${REQUEST_OBJECT_ERROR}: In the array, the element with index 0 is not a string`
  );

  e(
    "",
    () =>
      compile(createTestObj2(`{{ "src":"/api/test" }}`), {
        allowedContentTypes: {} as any
      }),
    `${COMPILE_OPTIONS_ERROR}: Expected "*" or string array, but got neither`
  );

  e(
    "",
    () =>
      compile(createTestObj2(`{{ "src":"/api/test" }}`), {
        allowedContentTypes: [1] as any
      }),
    `${COMPILE_OPTIONS_ERROR}: In the array, the element with index 0 is not a string`
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
    `${RENDER_ERROR}: Template includes only one node of the Element type or one response object`
  );
  e(
    "",
    () => compile(createTestObj2(`{{ "src":"/api/test", "autoBody": true }}`)),
    `${REQUEST_OBJECT_ERROR}: The "${AUTO_BODY}" property does not work without the "${AFTER}" property`
  );
  e(
    "",
    () =>
      compile(
        createTestObj2(
          `<form id="form"></form>{{ "src":"/api/test", "after":"submit" }}`
        )
      ),
    `${REQUEST_OBJECT_ERROR}: The "${AFTER}" property doesn't work without EventTargets`
  );
  e(
    "",
    () =>
      compile(
        createTestObj2(
          `<form id="form"></form>{{ "src":"/api/test", "repeat":true }}`
        )
      ),
    `${REQUEST_OBJECT_ERROR}: The "${MODE}" property doesn't work without "${AFTER}" property`
  );
  eq(
    "",
    checkFunction(compile(createTestObj2(`{{ "src":"/api/test" }}`))),
    true
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form", "autoBody": false }}`
      ),
      {
        autoBody: true
      }
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form", "autoBody": true }}`
      ),
      {
        autoBody: false
      }
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form" }}`
      ),
      {
        autoBody: false
      }
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form" }}`
      ),
      {
        autoBody: true
      }
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form" }}`
      ),
      {
        autoBody: {
          formData: false
        }
      }
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form" }}`
      ),
      {
        autoBody: {
          formData: true
        }
      }
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form", "autoBody": { "formData": true }  }}`
      ),
      {
        autoBody: false
      }
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form", "autoBody": { "formData": true }  }}`
      ),
      {
        autoBody: true
      }
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form", "autoBody": { "formData": true } }}`
      )
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form", "autoBody": { "formData": false } }}`
      )
    )().response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form", "autoBody": { "formData": false } }}`
      )
    )(() => ({})).response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form", "autoBody": { "formData": false }, "initId":"1" }}`
      )
    )([
      {
        id: "1",
        value: {}
      }
    ]).response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--></div>'
  );
  eq(
    "",
    compile(
      createTestObj2(
        `<form id="form"></form>{{ "src":"/api/test", "after":"submit:#form", "initId":"1" }} {{ "src":"/api/test", "after":"submit:#form", "initId":"2" }}`
      )
    )([
      {
        id: "1",
        value: {}
      },
      {
        id: "2",
        value: {}
      }
    ]).response?.outerHTML,
    '<div><form id="form"></form><!--hmpl0--><!--hmpl1--></div>'
  );
});
