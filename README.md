<div>
    <a href="https://www.npmjs.com/package/hmpl-js">
        <img src="https://raw.githubusercontent.com/hmpl-language/media/5fa1a22fdec0fcc1820440b16f46d63b7bfd14ee/banner.png" alt="hmpl">
    </a>
</div>
<br/>
<div>

[![npm-version](https://img.shields.io/npm/v/hmpl-js?logo=npm&color=0183ff&style=for-the-badge)](https://www.npmjs.com/package/hmpl-js)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/hmpl-js?logo=npm&color=0183ff&style=for-the-badge)](https://bundlephobia.com/package/hmpl-js) 
[![codecov](https://img.shields.io/codecov/c/github/hmpl-language/hmpl?style=for-the-badge&logo=codecov&logoColor=ffffff&label=CODECOV&color=0183ff
)](https://codecov.io/github/hmpl-language/hmpl)
[![issues](https://img.shields.io/github/issues/hmpl-language/hmpl?logo=github&color=0183ff&style=for-the-badge)](https://github.com/hmpl-language/hmpl/issues) 
[![x.com](https://img.shields.io/badge/follow-0183ff?style=for-the-badge&logo=x&labelColor=555555)](https://x.com/hmpljs)

</div>
<div><a href="https://hmpl-lang.dev">Website</a> • <a href="https://hmpl-lang.dev/introduction.html">Documentation</a> • <a href="https://codesandbox.io/p/sandbox/basic-hmpl-example-dxlgfg">Demo Sandbox</a> • <a href="https://hmpl-lang.dev/examples.html">Examples</a>
</div>
<br/>

<div>hmpl is a small template language for displaying UI from server to client. It is based on <em>customizable</em> requests sent to the server via <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">fetch</a> and processed into ready-made HTML. Reduce the size of your javascript files and display the same UI as if it was written in a modern framework.</div>

## Usage

```javascript
import hmpl from "hmpl-js";

document.querySelector("#app").append(
  hmpl.compile(
    `<div>
        <button data-action="increment" id="btn">Click!</button>
        <div>Clicks: { { "src": "/api/clicks", "after": "click:#btn" } }</div>
    </div>`
  )(({ request: { event } }) => ({
    body: event.target.getAttribute("data-action")
  })).response
);
```

## Features

- **Customizable**: Send a custom request to the server when receiving the UI
- **Based on Fetch API**: Use a modern standard instead of `XMLHTTPRequest`
- **Server-oriented**: Work with the server directly through markup and with a little js
- **Memory Preserving**: Reduce file sizes on the client by several times
- **Simple**: Get ready-made UI from the server by writing a couple of lines of familiar object syntax
- **Flexible**: Can be used in almost any project due to not only working through a script, but also working in files with the `.hmpl` extension
- **No dependencies**: Can connect from one js file
- **Small bundle size**: Lots of functionality in a couple of kilobytes

## Ecosystem

<a href="https://www.npmjs.com/package/hmpl-loader"><img src="https://raw.githubusercontent.com/hmpl-language/media/refs/heads/main/Webpack.svg" alt="hmpl-loader" height="40"/></a>
<a href="https://marketplace.visualstudio.com/items?itemName=hmpljs.hmpl"><img src="https://raw.githubusercontent.com/hmpl-language/media/refs/heads/main/VS%20Code.svg" height="40" alt="vs-code extension"/></a>

## Community support

The [documentation](https://hmpl-lang.dev/introduction.html) contains main information on how the HMPL template language works. If you have any questions about how HMPL works, you can use the following resources:

- [Github](https://github.com/hmpl-language/hmpl) -  In the discussion and issues sections you can ask any question you are interested in.
- [𝕏 (Twitter)](https://x.com/hmpljs) - There is a lot of interesting stuff there, concerning the template language and not only :)

You can also ask your question on [Stack Overflow](https://stackoverflow.com/) and address it in the resources described above.

## Contribution

We have a [Contributing Guide](https://github.com/hmpl-language/hmpl/blob/main/CONTRIBUTING.md) that describes the main steps for contributing to the project.

Thank you to all the people who have already contributed to HMPL, or related projects!

## Fossa status

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhmpl-language%2Fhmpl.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhmpl-language%2Fhmpl?ref=badge_large&issueType=license)
