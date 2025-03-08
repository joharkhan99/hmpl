require("jsdom-global")();
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");

global.DOMParser = window.DOMParser;

const jsdom = new JSDOM("");
(global as any).window = jsdom.window;
(global as any).document = jsdom.window.document;
const DOMPurifyInstance = createDOMPurify(jsdom.window);
(global as any).DOMPurify = DOMPurifyInstance;
(global as any).window.DOMPurify = DOMPurifyInstance;
