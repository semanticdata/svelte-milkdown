<h1 align=center>Svelte 🥛 Milkdown</h1>

<p align="center">
  <img src="https://img.shields.io/github/languages/code-size/semanticdata/svelte-milkdown" />
  <img src="https://img.shields.io/github/repo-size/semanticdata/svelte-milkdown" />
  <img src="https://img.shields.io/github/commit-activity/t/semanticdata/svelte-milkdown" />
  <img src="https://img.shields.io/github/last-commit/semanticdata/svelte-milkdown" />
  <img src="https://img.shields.io/website/https/svelte-milkdown.vercel.app.svg" />
</p>

## Introduction

A simple example for using milkdown with svelte.

[Open in StackBlitz](https://stackblitz.com/github/Milkdown/examples/tree/main/svelte-commonmark)

## Getting Started

1. Clone the repo.

2. Install dependencies by `pnpm install`.

3. Run the example by `pnpm start`.

## Helpful Links

- [Interacting with the Editor](https://milkdown.dev/docs/guide/interacting-with-editor)

## Interacting with Editor

### Register to DOM

By default, milkdown will create editor on the document.body. Alternatively, you can also point out which dom node you want it to load into:

```js
import { rootCtx } from '@milkdown/core';

Editor.make().config((ctx) => {
    ctx.set(rootCtx, document.querySelector('#editor'));
});
```

It's also possible to just pass a selector to rootCtx:

> The selector will be passed to document.querySelector to get the dom.

```js
import { rootCtx } from '@milkdown/core';

Editor.make().config((ctx) => {
    ctx.set(rootCtx, '#editor');
});
```

### Setting Default Value

We support three types of default values:

- Markdown strings.
- HTML DOM.
- Prosemirror documentation JSON.

### Markdown

You can set a markdown string as the default value of the editor.

```js
import { defaultValueCtx } from '@milkdown/core';

const defaultValue = '# Hello milkdown';
Editor.make().config((ctx) => {
    ctx.set(defaultValueCtx, defaultValue);
});
```

And then the editor will be rendered with default value.

### DOM

You can also use HTML as default value.

Let's assume that we have the following html snippets:

```js
<div id="pre">
    <h1>Hello milkdown!</h1>
</div>
```

Then we can use it as a defaultValue with a type specification:

```js
import { defaultValueCtx } from '@milkdown/core';

const defaultValue = {
    type: 'html',
    dom: document.querySelector('#pre'),
};
Editor.make().config((ctx) => {
    ctx.set(defaultValueCtx, defaultValue);
});
```

### JSON

We can also use a JSON object as a default value.

This JSON object can be obtained by a listener through the listener-plugin, for example:

```js
import { listener, listenerCtx } from '@milkdown/plugin-listener';

let jsonOutput;

Editor.make()
    .config((ctx) => {
        ctx.get(listenerCtx).updated((ctx, doc, prevDoc) => {
            jsonOutput = doc.toJSON();
        });
    })
    .use(listener);
```

Then we can use this jsonOutput as default Value:

```js
import { defaultValueCtx } from '@milkdown/core';

const defaultValue = {
    type: 'json',
    value: jsonOutput,
};
Editor.make().config((ctx) => {
    ctx.set(defaultValueCtx, defaultValue);
});
```

## Inspecting Editor Status

You can inspect the editor's status through the status property.

```js
import { Editor, EditorStatus } from '@milkdown/core';

const editor = Editor.make().use(/*some plugins*/);

assert(editor.status === EditorStatus.Idle);

editor.create().then(() => {
  assert(editor.status === EditorStatus.Created);
});

assert(editor.status === EditorStatus.OnCreate);

editor.destroy().then(() => {
  assert(editor.status === EditorStatus.Destroyed);
});

assert(editor.status === EditorStatus.OnDestroyed);
```

You can also listen to the status changes:

```js
import { Editor, EditorStatus } from '@milkdown/core';

const editor = Editor.make().use(/*some plugins*/);

editor.onStatusChange((status: EditorStatus) => {
  console.log(status);
});
```

## Adding Listeners

As mentioned above, you can add a listener to the editor, in order to get it's value when needed.

Markdown Listener

You can add markdown listener to get the editor's contents as a markdown string.

You can add as many listeners as you want, all the listeners will be triggered at once.

```js
import { listener, listenerCtx } from '@milkdown/plugin-listener';

let output = '';

Editor.make()
    .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
            output = markdown;
        });
    })
    .use(listener);
```

### Doc Listener

You can also listen to the raw prosemirror document node, and do things you want from there.

```js
import { listener, listenerCtx } from '@milkdown/plugin-listener';

let jsonOutput;

Editor.make()
    .config((ctx) => {
        ctx.get(listenerCtx).updated((ctx, doc, prevDoc) => {
            jsonOutput = doc.toJSON();
        });
    })
    .use(listener);
```

For more details about listeners, please check Using Listeners.

## Readonly Mode

You can set the editor to readonly mode by setting the editable property.

```js
import { editorViewOptionsCtx } from '@milkdown/core';

let readonly = false;

const editable = () => !readonly;

Editor.make().config((ctx) => {
  ctx.update(editorViewOptionsCtx, (prev) => ({
    ...prev,
    editable,
  }))
});

// set to readonly after 5 secs.
setTimeout(() => {
    readonly = true;
}, 5000);
```

## Using Actions

You can use an action to get the context value in a running editor on demand.

For example, to get the markdown string by running an action:

```js
import { Editor, editorViewCtx, serializerCtx } from '@milkdown/core';

async function playWithEditor() {
    const editor = await Editor.make().use(commonmark).create();

    const getMarkdown = () =>
        editor.action((ctx) => {
            const editorView = ctx.get(editorViewCtx);
            const serializer = ctx.get(serializerCtx);
            return serializer(editorView.state.doc);
        });

    // get markdown string:
    getMarkdown();
}
```

We provide some macros out of the box, you can use them as actions:

```js
import { insert } from '@milkdown/utils';

editor.action(insert('# Hello milkdown'));
```

For more details about macros, please check macros.

## Destroying

You can call editor.destroy to destroy an existing editor. You can create a new editor again with editor.create.

```js
await editor.destroy();

// Then create again
await editor.create();
```

If you just want to recreate the editor, you can use editor.create, it will destroy the old editor and create a new one.

```js
await editor.create();

// This equals to call `editor.destroy` and `editor.create` again.
await editor.create();
```

If you want to clear the plugins and configs for the editor when calling editor.destroy, you can pass true to editor.destroy.

```js
await editor.destroy(true);
```

## Official Plugins

Milkdown provides the following official plugins:
| name                                                                                           | description                                                            |
| :--------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| [@milkdown/preset-commonmark](https://www.npmjs.com/package/@milkdown/preset-commonmark)       | Add [commonmark](https://commonmark.org/) syntax support               |
| [@milkdown/preset-gfm](https://www.npmjs.com/package/@milkdown/preset-gfm)                     | Add [gfm](https://github.github.com/gfm/) syntax support               |
| [@milkdown/plugin-history](https://www.npmjs.com/package/@milkdown/plugin-history)             | Add undo & redo support                                                |
| [@milkdown/plugin-clipboard](https://www.npmjs.com/package/@milkdown/plugin-clipboard)         | Add markdown copy & paste support                                      |
| [@milkdown/plugin-cursor](https://www.npmjs.com/package/@milkdown/plugin-cursor)               | Add drop & gap cursor                                                  |
| [@milkdown/plugin-listener](https://www.npmjs.com/package/@milkdown/plugin-listener)           | Add listener support                                                   |
| [@milkdown/plugin-collaborative](https://www.npmjs.com/package/@milkdown/plugin-collaborative) | Add collaborative editing support                                      |
| [@milkdown/plugin-prism](https://www.npmjs.com/package/@milkdown/plugin-prism)                 | Add [prism](https://prismjs.com/) support for code block highlight     |
| [@milkdown/plugin-math](https://www.npmjs.com/package/@milkdown/plugin-math)                   | Add [LaTeX](https://en.wikipedia.org/wiki/LaTeX) support for math      |
| [@milkdown/plugin-tooltip](https://www.npmjs.com/package/@milkdown/plugin-tooltip)             | Add selected tooltip for text                                          |
| [@milkdown/plugin-slash](https://www.npmjs.com/package/@milkdown/plugin-slash)                 | Add slash commands support                                             |
| [@milkdown/plugin-emoji](https://www.npmjs.com/package/@milkdown/plugin-emoji)                 | Add emoji support                                                      |
| [@milkdown/plugin-diagram](https://www.npmjs.com/package/@milkdown/plugin-diagram)             | Add [mermaid](https://mermaid-js.github.io/mermaid/#/) diagram support |
| [@milkdown/plugin-indent](https://www.npmjs.com/package/@milkdown/plugin-indent)               | Add tab indent support                                                 |
| [@milkdown/plugin-upload](https://www.npmjs.com/package/@milkdown/plugin-upload)               | Add drop and upload support                                            |

## Community Plugins

- [milkdown-plugin-shiki](https://www.npmjs.com/package/milkdown-plugin-shiki)  
Add [shiki](https://shiki.matsu.io/) support for code block highlight.
- [@star-dancer/milkdown](https://www.npmjs.com/package/@star-dancer/milkdown)  
Angular integration for milkdown.
- [@ezone-devops/milkdown-plugin-directive-fallback](https://www.npmjs.com/package/@ezone-devops/milkdown-plugin-directive-fallback)  
Render all directive as text to avoid parse error when use remark-directive.
- [milkdown-plugin-image-picker](https://github.com/LittleSound/milkdown-plugin-image-picker)  
Add support for select and upload pictures from file picker.
- [milkdown-plugin-placeholder](https://github.com/HexMox/milkdown-plugin-placeholder)  
🌈 Placeholder plugin for milkdown.
- [@milkdown-lab/plugin-split-editing](https://www.npmjs.com/package/@milkdown-lab/plugin-split-editing)  
Show split editing view for milkdown.
- [milkdown-lab](https://github.com/enpitsuLin/milkdown-lab)  
Unofficial plugins collection for milkdown.

## Apps & Integrations

- [milkdown-vscode](https://github.com/Saul-Mirone/milkdown-vscode)  
Use milkdown as markdown editor of VSCode.
- [standardnotes](https://github.com/standardnotes/app)  
Use milkdown as editor of [Standard Notes](https://standardnotes.com/), it's made by the official of standardnotes.
- [tagspaces](https://www.tagspaces.org/)  
Use milkdown as editor of markdown files.
- [MarginNote-Milkdown](https://github.com/marginnoteapp/milkdown)  
Use milkdown as markdown editor of [MarginNote](https://www.marginnote.com/), it's made by the official of MarginNote. MarginNote is a brand new e-reader to better study and digest your books.
- [lactose](https://github.com/lactoseapp/lactose)  
A web based note-taking tool.
- [vite-plugin-book](https://github.com/Saul-Mirone/vite-plugin-book)  
A magical vite plugin that helps you to generate and manage documentation website.
- [Howdz Dashboard](https://github.com/leon-kfd/Dashboard)  
Custom your personal browser start page from some configurable components.
- [Doclea](https://github.com/FalkZ/doclea)  
Online doc editor.
- [ezone](https://ezone.work/)  
一站式云原生企业研发协同与效能平台.
- [standardnotes-milkdown](https://github.com/chuangzhu/standardnotes-milkdown)  
Use milkdown as editor of [Standard Notes](https://standardnotes.com/).
- [typelog](https://typelog.dev)  
Microblogging platform for devs. Uses milkdown as the editor for writing posts and comments.

## License

Source code in this repository is available under the [MIT](LICENSE) license. You are free to use this code however you see fit. That said, some acknowledgement would be well received.
