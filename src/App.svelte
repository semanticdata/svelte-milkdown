<script lang="ts">
  import {Editor, rootCtx, defaultValueCtx} from '@milkdown/core'
  import {commonmark} from '@milkdown/preset-commonmark'
  import {nord} from '@milkdown/theme-nord'

  import {history} from '@milkdown/plugin-history'
  import {clipboard} from '@milkdown/plugin-clipboard'
  import {gfm} from '@milkdown/preset-gfm'
  import {cursor} from '@milkdown/plugin-cursor'

  import {listener, listenerCtx} from '@milkdown/plugin-listener'
  let jsonOutput

  const markdown = `# Milkdown Svelte Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Svelte**.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce bibendum neque eget nunc mattis eu sollicitudin enim tincidunt. Vestibulum lacus tortor, ultricies id dignissim ac, bibendum in velit.

## Text Formatting

Text can be **bold**, _italic_, or ~~strikethrough~~.  
**Bold**, _Italic_, _**Both**_.  
**Bold**, _Italic_, ~~Strikethrough~~, ~~_**ALL OF THEM**_~~.

## Links

You can [link](https://example.dom/).

## Blockquotes

### Simple Example

> This is a blockquote  
> with several lines

## Lists

### Ordered List

1. First item
2. Second item
3. Third item

### Unordered List

* List item
* Another item
* And another item

## Images

![image](https://just-the-docs.com/assets/images/small-image.jpg)`

  function editor(dom) {
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, dom)
        ctx.set(defaultValueCtx, markdown)
        ctx.get(listenerCtx).updated((ctx, doc, prevDoc) => {
          jsonOutput = doc.toJSON()
        })
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(clipboard)
      .use(cursor)
      .use(listener)
      .create()
  }
</script>

<main>
  <div use:editor />
</main>
