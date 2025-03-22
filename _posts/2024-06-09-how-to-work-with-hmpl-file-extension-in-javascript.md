---
layout: post
title: "How to work with .hmpl file extension in javascript?"
date: 2024-06-09 2:10 PM
categories: blog
---

In order to work with files with the `.hmpl` extension, you can install a [webpack](https://www.npmjs.com/package/webpack) and loader for it [hmpl-loader](https://www.npmjs.com/package/hmpl-loader). Since version `0.0.2`, the loader connection looks like this:

### webpack.config.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.hmpl$/i,
        use: ["hmpl-loader"],
      },
    ],
  },
};
```

### main.hmpl

```html
<div><request src="/api/test"></request></div>
```

### main.js

```javascript
const templateFn = require("./main.hmpl");

const elementObj = templateFn();
```
