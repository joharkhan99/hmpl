"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

var main_exports = {};
__export(main_exports, {
  compile: () => compile,
  stringify: () => stringify
});
module.exports = __toCommonJS(main_exports);
var import_json5 = __toESM(require("json5"));
var checkObject = (val) => {
  return typeof val === "object" && !Array.isArray(val) && val !== null;
};
var checkIsStringArray = (arr, currentError) => {
  if (!Array.isArray(arr)) return false;
  let isArrString = true;
  for (let i = 0; i < arr.length; i++) {
    const arrItem = arr[i];
    if (typeof arrItem !== "string") {
      createError(
        `${currentError}: In the array, the element with index ${i} is not a string`
      );
      isArrString = false;
      break;
    }
  }
  return isArrString;
};
var checkFunction = (val) => {
  return Object.prototype.toString.call(val) === "[object Function]";
};
var createError = (text) => {
  throw new Error(text);
};
var createWarning = (text) => {
  console.warn(text);
};
var getIsMethodValid = (method) => {
  return method !== "get" && method !== "post" && method !== "put" && method !== "delete" && method !== "patch";
};
var SOURCE = `src`;
var METHOD = `method`;
var ID = `initId`;
var AFTER = `after`;
var MODE = `repeat`;
var MEMO = `memo`;
var INDICATORS = `indicators`;
var AUTO_BODY = `autoBody`;
var COMMENT = `hmpl`;
var FORM_DATA = `formData`;
var ALLOWED_CONTENT_TYPES = "allowedContentTypes";
var REQUEST_INIT_GET = `get`;
var RESPONSE_ERROR = `BadResponseError`;
var REQUEST_INIT_ERROR = `RequestInitError`;
var RENDER_ERROR = `RenderError`;
var REQUEST_OBJECT_ERROR = `RequestObjectError`;
var COMPILE_OPTIONS_ERROR = `CompileOptionsError`;
var PARSE_ERROR = `ParseError`;
var COMPILE_ERROR = `CompileError`;
var DEFAULT_AUTO_BODY = {
  formData: true
};
var DEFAULT_FALSE_AUTO_BODY = {
  formData: false
};
var MAIN_REGEX = /(\{\{(?:.|\n|\r)*?\}\}|\{\s*\{(?:.|\n|\r)*?\}\s*\})/g;
var BRACKET_REGEX = /([{}])|([^{}]+)/g;
var REQUEST_OPTIONS = [
  SOURCE,
  METHOD,
  ID,
  AFTER,
  MODE,
  INDICATORS,
  MEMO,
  AUTO_BODY,
  ALLOWED_CONTENT_TYPES
];
var CODES = [
  100,
  101,
  102,
  103,
  300,
  301,
  302,
  303,
  304,
  305,
  306,
  307,
  308,
  400,
  401,
  402,
  403,
  404,
  405,
  406,
  407,
  408,
  409,
  410,
  411,
  412,
  413,
  414,
  415,
  416,
  417,
  418,
  421,
  422,
  423,
  424,
  425,
  426,
  428,
  429,
  431,
  451,
  500,
  501,
  502,
  503,
  504,
  505,
  506,
  507,
  508,
  510,
  511
];
var DEFAULT_ALLOWED_CONTENT_TYPES = ["text/html"];
var getTemplateWrapper = (str) => {
  const elementDocument = new DOMParser().parseFromString(
    `<template>${str}</template>`,
    "text/html"
  );
  const elWrapper = elementDocument.childNodes[0].childNodes[0].firstChild;
  return elWrapper;
};
var getResponseElements = (response) => {
  const elWrapper = getTemplateWrapper(response);
  const elContent = elWrapper["content"];
  const scripts = elContent.querySelectorAll("script");
  for (let i = 0; i < scripts.length; i++) {
    const currentScript = scripts[i];
    elContent.removeChild(currentScript);
  }
  return elWrapper;
};
var getIsNotAllowedContentType = (contentType, allowedContentTypes) => {
  if (!contentType) return true;
  let isContain = false;
  for (let i = 0; i < allowedContentTypes.length; i++) {
    const allowedContentType = allowedContentTypes[i];
    if (contentType.includes(allowedContentType)) {
      isContain = true;
      break;
    }
  }
  return !isContain;
};
var makeRequest = (el, mainEl, dataObj, method, source, isRequest, isRequests, isMemo, options = {}, templateObject, allowedContentTypes, reqObject, indicators) => {
  const {
    mode,
    cache,
    redirect,
    get,
    referrerPolicy,
    signal,
    credentials,
    timeout,
    referrer,
    headers,
    body,
    window: windowOption,
    integrity
  } = options;
  const initRequest = {
    method: method.toUpperCase()
  };
  if (credentials !== void 0) {
    initRequest.credentials = credentials;
  }
  if (body !== void 0) {
    initRequest.body = body;
  }
  if (mode !== void 0) {
    initRequest.mode = mode;
  }
  if (cache !== void 0) {
    initRequest.cache = cache;
  }
  if (redirect !== void 0) {
    initRequest.redirect = redirect;
  }
  if (referrerPolicy !== void 0) {
    initRequest.referrerPolicy = referrerPolicy;
  }
  if (integrity !== void 0) {
    initRequest.integrity = integrity;
  }
  if (referrer !== void 0) {
    initRequest.referrer = referrer;
  }
  const isHaveSignal = signal !== void 0;
  if (isHaveSignal) {
    initRequest.signal = signal;
  }
  if (windowOption !== void 0) {
    initRequest.window = windowOption;
  }
  if (options.keepalive !== void 0) {
    createWarning(
      `${REQUEST_INIT_ERROR}: The "keepalive" property is not yet supported`
    );
  }
  if (headers) {
    if (checkObject(headers)) {
      const newHeaders = new Headers();
      for (const key in headers) {
        const value = headers[key];
        const valueType = typeof value;
        if (valueType === "string") {
          newHeaders.set(key, value);
        } else {
          createError(
            `${REQUEST_INIT_ERROR}: Expected type string, but received type ${valueType}`
          );
        }
      }
      initRequest.headers = newHeaders;
    } else {
      createError(
        `${REQUEST_INIT_ERROR}: The "headers" property must contain a value object`
      );
    }
  }
  if (timeout) {
    if (!isHaveSignal) {
      initRequest.signal = AbortSignal.timeout(timeout);
    } else {
      createWarning(
        `${REQUEST_INIT_ERROR}: The "signal" property overwrote the AbortSignal from "timeout"`
      );
    }
  }
  const isRequestMemo = isMemo && !isRequest && dataObj?.memo;
  const getIsNotFullfilledStatus = (status) => status === "rejected" || typeof status === "number" && (status < 200 || status > 299);
  const callGetResponse = (reqResponse) => {
    if (isRequests) {
      reqObject.response = reqResponse;
      get?.("response", reqResponse, reqObject);
    }
    get?.("response", mainEl);
  };
  const updateNodes = (content, isClone = true, isNodes = false) => {
    if (isRequest) {
      templateObject.response = content.cloneNode(true);
      get?.("response", content);
    } else {
      let reqResponse = [];
      const newContent = isClone ? content.cloneNode(true) : content;
      const nodes = [...newContent.content.childNodes];
      if (dataObj.nodes) {
        const parentNode = dataObj.parentNode;
        const newNodes = [];
        const nodesLength = dataObj.nodes.length;
        for (let i = 0; i < nodesLength; i++) {
          const node = dataObj.nodes[i];
          if (i === nodesLength - 1) {
            for (let j = 0; j < nodes.length; j++) {
              const reqNode = nodes[j];
              const newNode = parentNode.insertBefore(reqNode, node);
              newNodes.push(newNode);
            }
          }
          parentNode.removeChild(node);
        }
        reqResponse = newNodes.slice();
        dataObj.nodes = newNodes;
      } else {
        const parentNode = el.parentNode;
        const newNodes = [];
        const nodesLength = nodes.length;
        for (let i = 0; i < nodesLength; i++) {
          const node = nodes[i];
          const newNode = parentNode.insertBefore(node, el);
          newNodes.push(newNode);
        }
        parentNode.removeChild(el);
        reqResponse = newNodes.slice();
        dataObj.nodes = newNodes;
        dataObj.parentNode = parentNode;
      }
      if (isRequestMemo && isNodes) {
        dataObj.memo.nodes = dataObj.nodes;
        if (dataObj.memo.isPending) dataObj.memo.isPending = false;
      }
      callGetResponse(reqResponse);
    }
  };
  let isNotHTMLResponse = false;
  const setComment = () => {
    if (isRequest) {
      templateObject.response = void 0;
      get?.("response", void 0);
    } else {
      if (dataObj?.nodes) {
        const parentNode = dataObj.parentNode;
        const nodesLength = dataObj.nodes.length;
        for (let i = 0; i < nodesLength; i++) {
          const node = dataObj.nodes[i];
          if (i === nodesLength - 1) {
            parentNode.insertBefore(dataObj.comment, node);
          }
          parentNode.removeChild(node);
        }
        dataObj.nodes = null;
        dataObj.parentNode = null;
        if (isRequests) {
          reqObject.response = void 0;
          get?.("response", void 0, reqObject);
        }
        get?.("response", mainEl);
      }
    }
    if (isRequestMemo) {
      if (dataObj.memo.response !== null) {
        dataObj.memo.response = null;
        delete dataObj.memo.isPending;
        delete dataObj.memo.nodes;
      }
    }
  };
  const updateIndicator = (status) => {
    if (indicators) {
      if (isRequestMemo && status !== "pending" && getIsNotFullfilledStatus(status)) {
        if (dataObj.memo.isPending) dataObj.memo.isPending = false;
      }
      if (status === "pending") {
        const content = indicators["pending"];
        if (content !== void 0) {
          if (isRequestMemo) {
            dataObj.memo.isPending = true;
          }
          updateNodes(content);
        }
      } else if (status === "rejected") {
        const content = indicators["rejected"];
        if (content !== void 0) {
          updateNodes(content);
        } else {
          const errorContent = indicators["error"];
          if (errorContent !== void 0) {
            updateNodes(errorContent);
          } else {
            setComment();
          }
        }
      } else {
        const content = indicators[`${status}`];
        if (status > 399) {
          if (content !== void 0) {
            updateNodes(content);
          } else {
            const errorContent = indicators["error"];
            if (errorContent !== void 0) {
              updateNodes(errorContent);
            } else {
              setComment();
            }
          }
        } else {
          if (status < 200 || status > 299) {
            isNotHTMLResponse = true;
            if (content !== void 0) {
              updateNodes(content);
            } else {
              setComment();
            }
          }
        }
      }
    }
  };
  const updateStatusDepenencies = (status) => {
    if (isRequests) {
      if (reqObject.status !== status) {
        reqObject.status = status;
        get?.("status", status, reqObject);
      }
    } else {
      if (templateObject.status !== status) {
        templateObject.status = status;
        get?.("status", status);
      }
    }
    if (isRequestMemo && getIsNotFullfilledStatus(status)) {
      dataObj.memo.response = null;
      delete dataObj.memo.nodes;
    }
    updateIndicator(status);
  };
  const takeNodesFromCache = () => {
    if (dataObj.memo.isPending) {
      const parentNode = dataObj.parentNode;
      const memoNodes = dataObj.memo.nodes;
      const currentNodes = dataObj.nodes;
      const nodesLength = currentNodes.length;
      const newNodes = [];
      for (let i = 0; i < nodesLength; i++) {
        const node = currentNodes[i];
        if (i === nodesLength - 1) {
          for (let j = 0; j < memoNodes.length; j++) {
            const reqNode = memoNodes[j];
            const newNode = parentNode.insertBefore(reqNode, node);
            newNodes.push(newNode);
          }
        }
        parentNode.removeChild(node);
      }
      dataObj.nodes = newNodes.slice();
      dataObj.memo.isPending = false;
      dataObj.memo.nodes = newNodes.slice();
    }
    const reqResponse = dataObj.nodes.slice();
    callGetResponse(reqResponse);
  };
  let requestStatus = 200;
  updateStatusDepenencies("pending");
  let isRejectedError = true;
  let isError = true;
  fetch(source, initRequest).then((response) => {
    isRejectedError = false;
    requestStatus = response.status;
    updateStatusDepenencies(requestStatus);
    if (!response.ok) {
      if (indicators) isError = false;
      createError(
        `${RESPONSE_ERROR}: Response with status code ${requestStatus}`
      );
    }
    if (Array.isArray(allowedContentTypes) && allowedContentTypes.length !== 0) {
      const contentType = response.headers.get("Content-Type");
      if (getIsNotAllowedContentType(contentType, allowedContentTypes)) {
        createError(
          `${RESPONSE_ERROR}: Expected ${allowedContentTypes.map((type) => `"${type}"`).join(", ")}, but received "${contentType}"`
        );
      }
    }
    return response.text();
  }).then((data) => {
    if (!isNotHTMLResponse) {
      if (isRequestMemo) {
        const { response } = dataObj.memo;
        if (response === null) {
          dataObj.memo.response = data;
        } else {
          if (response === data) {
            takeNodesFromCache();
            return;
          } else {
            dataObj.memo.response = data;
            delete dataObj.memo.nodes;
          }
        }
      }
      const templateWrapper = getResponseElements(data);
      if (isRequest) {
        templateObject.response = templateWrapper;
        get?.("response", templateWrapper);
      } else {
        const reqResponse = [];
        const nodes = [
          ...templateWrapper.content.childNodes
        ];
        if (dataObj) {
          updateNodes(templateWrapper, false, true);
        } else {
          const parentNode = el.parentNode;
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const reqNode = parentNode.insertBefore(node, el);
            if (isRequests) {
              reqResponse.push(reqNode);
            }
          }
          parentNode.removeChild(el);
          if (isRequests) {
            reqObject.response = reqResponse;
            get?.("response", reqResponse, reqObject);
          }
          get?.("response", mainEl);
        }
      }
    }
  }).catch((error) => {
    if (isRejectedError) {
      updateStatusDepenencies("rejected");
      if (!indicators) {
        setComment();
      }
    } else {
      if (isError) {
        setComment();
      }
    }
    throw error;
  });
};
var getRequestInitFromFn = (fn, event) => {
  const request = {};
  if (event !== void 0) {
    request.event = event;
  }
  const context = {
    request
  };
  const result = fn(context);
  return result;
};
var renderTemplate = (currentEl, fn, requests, compileOptions, isMemoUndefined, isAutoBodyUndefined, isAllowedContentTypesUndefined, isRequest = false) => {
  const renderRequest = (req, mainEl) => {
    const source = req.src;
    if (source) {
      const method = (req.method || "GET").toLowerCase();
      if (getIsMethodValid(method)) {
        createError(
          `${REQUEST_OBJECT_ERROR}: The "${METHOD}" property has only GET, POST, PUT, PATCH or DELETE values`
        );
      } else {
        const after = req.after;
        if (after && isRequest)
          createError(`${RENDER_ERROR}: EventTarget is undefined`);
        const isModeUndefined = !req.hasOwnProperty(MODE);
        const oldMode = isModeUndefined ? true : req.repeat;
        const modeAttr = oldMode ? "all" : "one";
        const isAll = modeAttr === "all";
        const isReqMemoUndefined = !req.hasOwnProperty(MEMO);
        let isMemo = isMemoUndefined ? false : compileOptions.memo;
        if (!isReqMemoUndefined) {
          if (after) {
            if (req.memo) {
              if (!isAll) {
                createError(
                  `${REQUEST_OBJECT_ERROR}: Memoization works in the enabled repetition mode`
                );
              } else {
                isMemo = true;
              }
            } else {
              isMemo = false;
            }
          } else {
            createError(
              `${REQUEST_OBJECT_ERROR}: Memoization works in the enabled repetition mode`
            );
          }
        } else {
          if (isMemo) {
            if (after) {
              if (!isAll) {
                isMemo = false;
              }
            } else {
              isMemo = false;
            }
          }
        }
        const isReqAutoBodyUndefined = !req.hasOwnProperty(AUTO_BODY);
        let autoBody = isAutoBodyUndefined ? false : compileOptions.autoBody;
        if (!isReqAutoBodyUndefined) {
          if (after) {
            let reqAutoBody = req[AUTO_BODY];
            validateAutoBody(reqAutoBody);
            if (autoBody === true) {
              autoBody = DEFAULT_AUTO_BODY;
            }
            if (reqAutoBody === true) {
              reqAutoBody = DEFAULT_AUTO_BODY;
            }
            if (reqAutoBody === false) {
              autoBody = false;
            } else {
              const newAutoBody = {
                ...autoBody === false ? DEFAULT_FALSE_AUTO_BODY : autoBody,
                ...reqAutoBody
              };
              autoBody = newAutoBody;
            }
          } else {
            autoBody = false;
            createError(
              `${REQUEST_OBJECT_ERROR}: The "${AUTO_BODY}" property does not work without the "${AFTER}" property`
            );
          }
        } else {
          if (autoBody === true) {
            autoBody = DEFAULT_AUTO_BODY;
          }
          if (!after) {
            autoBody = false;
          }
        }
        const isReqAllowedContentTypesUndefined = !req.hasOwnProperty(
          ALLOWED_CONTENT_TYPES
        );
        let allowedContentTypes = isAllowedContentTypesUndefined ? DEFAULT_ALLOWED_CONTENT_TYPES : compileOptions.allowedContentTypes;
        if (!isReqAllowedContentTypesUndefined) {
          const currentAllowedContentTypes = req[ALLOWED_CONTENT_TYPES];
          validateAllowedContentTypes(currentAllowedContentTypes);
          allowedContentTypes = currentAllowedContentTypes;
        }
        const initId = req.initId;
        const nodeId = req.nodeId;
        let indicators = req.indicators;
        if (indicators) {
          const parseIndicator = (val) => {
            const { trigger, content } = val;
            if (!trigger)
              createError(
                `${REQUEST_OBJECT_ERROR}: Failed to activate or detect the indicator`
              );
            if (!content)
              createError(
                `${REQUEST_OBJECT_ERROR}: Failed to activate or detect the indicator`
              );
            if (CODES.indexOf(trigger) === -1 && trigger !== "pending" && trigger !== "rejected" && trigger !== "error") {
              createError(
                `${REQUEST_OBJECT_ERROR}: Failed to activate or detect the indicator`
              );
            }
            const elWrapper = getTemplateWrapper(
              content
            );
            return {
              ...val,
              content: elWrapper
            };
          };
          const newOn = {};
          const uniqueTriggers = [];
          for (let i = 0; i < indicators.length; i++) {
            const currentIndicator = parseIndicator(indicators[i]);
            const { trigger } = currentIndicator;
            if (uniqueTriggers.indexOf(trigger) === -1) {
              uniqueTriggers.push(trigger);
            } else {
              createError(
                `${REQUEST_OBJECT_ERROR}: Indicator trigger must be unique`
              );
            }
            newOn[`${trigger}`] = currentIndicator.content;
          }
          indicators = newOn;
        }
        const getOptions = (options, isArray = false) => {
          if (isArray) {
            if (initId) {
              let result;
              for (let i = 0; i < options.length; i++) {
                const currentOptions = options[i];
                if (currentOptions.id === initId) {
                  result = currentOptions.value;
                  break;
                }
              }
              if (!result) {
                createError(
                  `${REQUEST_OBJECT_ERROR}: ID referenced by request not found`
                );
              }
              return result;
            } else {
              return {};
            }
          } else {
            if (initId)
              createError(
                `${REQUEST_OBJECT_ERROR}: ID referenced by request not found`
              );
            return options;
          }
        };
        const isDataObj = isAll && after;
        const reqFunction = (reqEl, options, templateObject, data, reqMainEl, isArray = false, reqObject, isRequests = false, currentHMPLElement, event) => {
          const id = data.currentId;
          if (isRequest) {
            if (!reqEl) reqEl = mainEl;
          } else {
            if (!reqEl) {
              let currentEl2;
              const { els } = data;
              for (let i = 0; i < els.length; i++) {
                const e = els[i];
                if (e.id === nodeId) {
                  currentHMPLElement = e;
                  currentEl2 = e.el;
                  break;
                }
              }
              reqEl = currentEl2;
            }
          }
          let dataObj;
          if (!isRequest) {
            if (isDataObj || indicators) {
              dataObj = currentHMPLElement.objNode;
              if (!dataObj) {
                dataObj = {
                  id,
                  nodes: null,
                  parentNode: null,
                  comment: reqEl
                };
                if (isMemo) {
                  dataObj.memo = {
                    response: null
                  };
                  if (indicators) {
                    dataObj.memo.isPending = false;
                  }
                }
                currentHMPLElement.objNode = dataObj;
                data.dataObjects.push(dataObj);
                data.currentId++;
              }
            }
          }
          let currentOptions = getOptions(options, isArray);
          const isOptionsFunction = checkFunction(currentOptions);
          if (!isOptionsFunction && currentOptions)
            currentOptions = { ...currentOptions };
          if (autoBody && autoBody.formData && event && !isOptionsFunction) {
            const { type, target } = event;
            if (type === "submit" && target && target instanceof HTMLFormElement && target.nodeName === "FORM") {
              currentOptions.body = new FormData(
                target,
                event.submitter
              );
            }
          }
          const requestInit = isOptionsFunction ? getRequestInitFromFn(
            currentOptions,
            event
          ) : currentOptions;
          if (!checkObject(requestInit) && requestInit !== void 0)
            createError(
              `${REQUEST_INIT_ERROR}: Expected an object with initialization options`
            );
          makeRequest(
            reqEl,
            reqMainEl,
            dataObj,
            method,
            source,
            isRequest,
            isRequests,
            isMemo,
            requestInit,
            templateObject,
            allowedContentTypes,
            reqObject,
            indicators
          );
        };
        let requestFunction = reqFunction;
        if (after) {
          const setEvents = (reqEl, event, selector, options, templateObject, data, isArray, isRequests, reqMainEl, reqObject, currentHMPLElement) => {
            const els = reqMainEl.querySelectorAll(selector);
            if (els.length === 0) {
              createError(`${RENDER_ERROR}: Selectors nodes not found`);
            }
            const afterFn = isAll ? (evt) => {
              reqFunction(
                reqEl,
                options,
                templateObject,
                data,
                reqMainEl,
                isArray,
                reqObject,
                isRequests,
                currentHMPLElement,
                evt
              );
            } : (evt) => {
              reqFunction(
                reqEl,
                options,
                templateObject,
                data,
                reqMainEl,
                isArray,
                reqObject,
                isRequests,
                currentHMPLElement,
                evt
              );
              for (let j = 0; j < els.length; j++) {
                const currentAfterEl = els[j];
                currentAfterEl.removeEventListener(event, afterFn);
              }
            };
            for (let i = 0; i < els.length; i++) {
              const afterEl = els[i];
              afterEl.addEventListener(event, afterFn);
            }
          };
          if (after.indexOf(":") > 0) {
            const afterArr = after.split(":");
            const event = afterArr[0];
            const selector = afterArr.slice(1).join(":");
            requestFunction = (reqEl, options, templateObject, data, reqMainEl, isArray = false, reqObject, isRequests = false, currentHMPLElement) => {
              setEvents(
                reqEl,
                event,
                selector,
                options,
                templateObject,
                data,
                isArray,
                isRequests,
                reqMainEl,
                reqObject,
                currentHMPLElement
              );
            };
          } else {
            createError(
              `${REQUEST_OBJECT_ERROR}: The "${AFTER}" property doesn't work without EventTargets`
            );
          }
        } else {
          if (!isModeUndefined) {
            createError(
              `${REQUEST_OBJECT_ERROR}: The "${MODE}" property doesn't work without "${AFTER}" property`
            );
          }
        }
        return requestFunction;
      }
    } else {
      createError(
        `${REQUEST_OBJECT_ERROR}: The "${SOURCE}" property are not found or empty`
      );
    }
  };
  let reqFn;
  if (isRequest) {
    requests[0].el = currentEl;
    reqFn = renderRequest(requests[0]);
  } else {
    let id = -2;
    const getRequests = (currrentElement) => {
      id++;
      if (currrentElement.nodeType == 8) {
        let value = currrentElement.nodeValue;
        if (value && value.startsWith(COMMENT)) {
          value = value.slice(4);
          const currentIndex = Number(value);
          const currentRequest = requests[currentIndex];
          if (Number.isNaN(currentIndex) || currentRequest === void 0) {
            createError(
              `${PARSE_ERROR}: Request object with id "${currentIndex}" not found`
            );
          }
          currentRequest.el = currrentElement;
          currentRequest.nodeId = id;
        }
      }
      if (currrentElement.hasChildNodes()) {
        const chNodes = currrentElement.childNodes;
        for (let i = 0; i < chNodes.length; i++) {
          getRequests(chNodes[i]);
        }
      }
    };
    getRequests(currentEl);
    if (requests.length > 1) {
      const algorithm = [];
      for (let i = 0; i < requests.length; i++) {
        const currentRequest = requests[i];
        algorithm.push(renderRequest(currentRequest, currentEl));
      }
      reqFn = (reqEl, options, templateObject, data, mainEl, isArray = false) => {
        if (!reqEl) {
          reqEl = mainEl;
        }
        const requests2 = [];
        const els = data.els;
        for (let i = 0; i < els.length; i++) {
          const hmplElement = els[i];
          const currentReqEl = hmplElement.el;
          const currentReqFn = algorithm[i];
          const currentReq = {
            response: void 0
          };
          currentReqFn(
            currentReqEl,
            options,
            templateObject,
            data,
            reqEl,
            isArray,
            currentReq,
            true,
            hmplElement
          );
          requests2.push(currentReq);
        }
        templateObject.requests = requests2;
      };
    } else {
      const currentRequest = requests[0];
      reqFn = renderRequest(currentRequest, currentEl);
    }
  }
  return fn(reqFn);
};
var validateOptions = (currentOptions) => {
  const isObject = checkObject(currentOptions);
  if (isObject && currentOptions.hasOwnProperty(`${REQUEST_INIT_GET}`)) {
    if (!checkFunction(currentOptions[REQUEST_INIT_GET])) {
      createError(
        `${REQUEST_INIT_ERROR}: The "${REQUEST_INIT_GET}" property has a function value`
      );
    }
  }
};
var validateAllowedContentTypes = (allowedContentTypes, isCompile = false) => {
  const currentError = isCompile ? COMPILE_OPTIONS_ERROR : REQUEST_OBJECT_ERROR;
  if (allowedContentTypes !== "*" && !checkIsStringArray(allowedContentTypes, currentError)) {
    createError(
      `${currentError}: Expected "*" or string array, but got neither`
    );
  }
};
var validateAutoBody = (autoBody, isCompile = false) => {
  const isObject = checkObject(autoBody);
  const currentError = isCompile ? COMPILE_OPTIONS_ERROR : REQUEST_OBJECT_ERROR;
  if (typeof autoBody !== "boolean" && !isObject)
    createError(
      `${currentError}: Expected a boolean or object, but got neither`
    );
  if (isObject) {
    for (const key in autoBody) {
      switch (key) {
        case FORM_DATA:
          if (typeof autoBody[FORM_DATA] !== "boolean")
            createError(
              `${currentError}: The "${FORM_DATA}" property should be a boolean`
            );
          break;
        default:
          createError(`${currentError}: Unexpected property "${key}"`);
          break;
      }
    }
  }
};
var validateIdOptions = (currentOptions) => {
  if (!currentOptions.hasOwnProperty("id") || !currentOptions.hasOwnProperty("value")) {
    createError(`${REQUEST_INIT_ERROR}: Missing "id" or "value" property`);
  }
};
var validateIdentificationOptionsArray = (currentOptions) => {
  const ids = [];
  for (let i = 0; i < currentOptions.length; i++) {
    const idOptions = currentOptions[i];
    if (!checkObject(idOptions))
      createError(
        `${REQUEST_INIT_ERROR}: IdentificationRequestInit is of type object`
      );
    validateIdOptions(idOptions);
    const { id } = idOptions;
    const isIdString = typeof idOptions.id === "string";
    if (!isIdString && typeof idOptions.id !== "number")
      createError(`${REQUEST_INIT_ERROR}: ID must be a string or a number`);
    if (ids.indexOf(id) > -1) {
      createError(
        `${REQUEST_INIT_ERROR}: ID with value ${isIdString ? `"${id}"` : id} already exists`
      );
    } else {
      ids.push(id);
    }
  }
};
var stringify = (info) => {
  return import_json5.default.stringify(info);
};
var compile = (template, options = {}) => {
  if (typeof template !== "string")
    createError(
      `${COMPILE_ERROR}: Template was not found or the type of the passed value is not string`
    );
  if (!template)
    createError(`${COMPILE_ERROR}: Template must not be a falsey value`);
  if (!checkObject(options))
    createError(`${COMPILE_OPTIONS_ERROR}: Options must be an object`);
  const isMemoUndefined = !options.hasOwnProperty(MEMO);
  if (!isMemoUndefined && typeof options[MEMO] !== "boolean")
    createError(
      `${COMPILE_OPTIONS_ERROR}: The value of the property ${MEMO} must be a boolean value`
    );
  const isAutoBodyUndefined = !options.hasOwnProperty(AUTO_BODY);
  if (!isAutoBodyUndefined) validateAutoBody(options[AUTO_BODY], true);
  const isAllowedContentTypesUndefined = !options.hasOwnProperty(
    ALLOWED_CONTENT_TYPES
  );
  if (!isAllowedContentTypesUndefined)
    validateAllowedContentTypes(options[ALLOWED_CONTENT_TYPES], true);
  const requests = [];
  const templateArr = template.split(MAIN_REGEX).filter(Boolean);
  const requestsIndexes = [];
  for (const match of template.matchAll(MAIN_REGEX)) {
    requestsIndexes.push(match.index);
  }
  if (requestsIndexes.length === 0)
    createError(`${PARSE_ERROR}: Request object not found`);
  const prepareText = (text) => {
    text = text.trim();
    text = text.replace(/\r?\n|\r/g, "");
    return text;
  };
  const setRequest = (text, i) => {
    const parsedData = import_json5.default.parse(text);
    for (const key in parsedData) {
      const value = parsedData[key];
      if (!REQUEST_OPTIONS.includes(key))
        createError(
          `${REQUEST_OBJECT_ERROR}: Property "${key}" is not processed`
        );
      switch (key) {
        case INDICATORS:
          if (!Array.isArray(value)) {
            createError(
              `${REQUEST_OBJECT_ERROR}: The value of the property "${key}" must be an array`
            );
          }
          break;
        case ID:
          if (typeof value !== "string" && typeof value !== "number") {
            createError(
              `${REQUEST_OBJECT_ERROR}: The value of the property "${key}" must be a string`
            );
          }
          break;
        case MEMO:
        case MODE:
          if (typeof value !== "boolean") {
            createError(
              `${REQUEST_OBJECT_ERROR}: The value of the property "${key}" must be a boolean value`
            );
          }
          break;
        case AUTO_BODY:
          validateAutoBody(value);
          break;
        case ALLOWED_CONTENT_TYPES:
          validateAllowedContentTypes(value);
          break;
        default:
          if (typeof value !== "string") {
            createError(
              `${REQUEST_OBJECT_ERROR}: The value of the property "${key}" must be a string`
            );
          }
          break;
      }
    }
    const requestObject = {
      ...parsedData,
      arrId: i
    };
    requests.push(requestObject);
  };
  let stringIndex = 0;
  for (let i = 0; i < templateArr.length; i++) {
    const text = templateArr[i];
    if (requestsIndexes.includes(stringIndex)) {
      const requestObjectArr = text.split(BRACKET_REGEX).filter(Boolean);
      let currentBracketId = -1;
      let newText = "";
      let isFirst = true;
      let isFinal = false;
      for (let j = 0; j < requestObjectArr.length; j++) {
        const requestText = requestObjectArr[j];
        const isOpen = requestText === "{";
        const isClose = requestText === "}";
        if (isOpen) {
          if (isFirst) {
            isFirst = false;
            if (requestObjectArr[j + 1] !== "{") j++;
          } else {
            newText += requestText;
          }
          currentBracketId++;
        } else if (isClose) {
          if (currentBracketId === 1) {
            isFinal = true;
          }
          if (currentBracketId === 0) {
            setRequest(newText, i);
            currentBracketId--;
            stringIndex += text.length;
            break;
          }
          currentBracketId--;
          newText += requestText;
        } else {
          if (isFinal) {
            if (prepareText(requestText)) {
              createError(
                `${PARSE_ERROR}: There is no empty space between the curly brackets`
              );
            }
          } else {
            newText += requestText;
          }
        }
      }
      if (currentBracketId !== -1) {
        const nextId = i + 1;
        const nextText = templateArr[nextId];
        const nextArr = nextText.split(BRACKET_REGEX).filter(Boolean);
        let newNextText = "";
        for (let j = 0; j < nextArr.length; j++) {
          const currentNextText = nextArr[j];
          const isOpen = currentNextText === "{";
          const isClose = currentNextText === "}";
          if (isClose) {
            if (currentBracketId === 1) {
              isFinal = true;
            }
            if (currentBracketId === 0) {
              const newNextArr = [...nextArr];
              stringIndex += text.length + nextText.length;
              newNextArr.splice(0, j + 1);
              templateArr[nextId] = newNextArr.join("");
              setRequest(newText + newNextText, i);
              currentBracketId--;
              i++;
              break;
            }
            currentBracketId--;
            newNextText += currentNextText;
          } else if (isOpen) {
            newNextText += currentNextText;
            currentBracketId++;
          } else {
            if (isFinal) {
              if (prepareText(currentNextText)) {
                createError(
                  `${PARSE_ERROR}: There is no empty space between the curly brackets`
                );
              }
            } else {
              newNextText += currentNextText;
            }
          }
        }
      }
    } else {
      stringIndex += text.length;
    }
  }
  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    const { arrId } = request;
    const comment = `<!--hmpl${i}-->`;
    templateArr[arrId] = comment;
    delete request.arrId;
  }
  template = templateArr.join("");
  let isRequest = false;
  const getElement = (template2) => {
    const elWrapper = getTemplateWrapper(
      template2.trim()
    );
    if (elWrapper.content.childNodes.length > 1 || elWrapper.content.children.length !== 1 && elWrapper.content.childNodes[0].nodeType !== 8) {
      createError(
        `${RENDER_ERROR}: Template includes only one node of the Element type or one response object`
      );
    }
    const prepareNode = (node) => {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          if (node.tagName === "PRE") return;
          break;
        case Node.TEXT_NODE:
          if (!/\S/.test(node.textContent)) {
            node.remove();
            return;
          }
          break;
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        prepareNode(node.childNodes.item(i));
      }
    };
    prepareNode(elWrapper.content.childNodes[0]);
    let currentEl = elWrapper.content.firstElementChild;
    if (!currentEl) {
      const comment = elWrapper.content.firstChild;
      const isComment = comment?.nodeType === 8;
      if (isComment) {
        isRequest = true;
        currentEl = comment;
      }
    }
    return currentEl;
  };
  const templateEl = getElement(template);
  const renderFn = (requestFunction) => {
    const templateFunction = (options2 = {}) => {
      const el = templateEl.cloneNode(true);
      const templateObject = {
        response: isRequest ? void 0 : el
      };
      const data = {
        dataObjects: [],
        els: [],
        currentId: 0
      };
      if (!isRequest) {
        let id = -2;
        const getRequests = (currrentElement) => {
          id++;
          if (currrentElement.nodeType == 8) {
            const value = currrentElement.nodeValue;
            if (value && value.startsWith(COMMENT)) {
              const elObj = {
                el: currrentElement,
                id
              };
              data.els.push(elObj);
            }
          }
          if (currrentElement.hasChildNodes()) {
            const chNodes = currrentElement.childNodes;
            for (let i = 0; i < chNodes.length; i++) {
              getRequests(chNodes[i]);
            }
          }
        };
        getRequests(el);
      }
      if (checkObject(options2) || checkFunction(options2)) {
        validateOptions(options2);
        requestFunction(
          void 0,
          options2,
          templateObject,
          data,
          el
        );
      } else if (Array.isArray(options2)) {
        validateIdentificationOptionsArray(
          options2
        );
        requestFunction(
          void 0,
          options2,
          templateObject,
          data,
          el,
          true
        );
      } else {
        createError(
          `${REQUEST_INIT_ERROR}: The type of the value being passed does not match the supported types for RequestInit`
        );
      }
      return templateObject;
    };
    return templateFunction;
  };
  return renderTemplate(
    templateEl,
    renderFn,
    requests,
    options,
    isMemoUndefined,
    isAutoBodyUndefined,
    isAllowedContentTypesUndefined,
    isRequest
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  compile,
  stringify
});
