import "./setup";
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

describe("compile function", () => {
  const e = (text: string, block: () => unknown, message: string) => {
    it(text, () => {
      assert.throws(block, {
        message
      });
    });
  };

  const createTestObj1 = (obj: Record<string, any>) => {
    return `<div>{${stringify(obj as HMPLRequestInfo)}}</div>`;
  };

  const createTestObj2 = (text: string) => {
    return `<div>${text}</div>`;
  };

  const eq = (text: string, block: unknown, equality: any) => {
    it(text, () => {
      assert.strictEqual(block, equality);
    });
  };

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
