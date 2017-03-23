# vscode-theme-generator

**The Problem**

- New themes are typically forked from other themes, carrying the bugs with them
- .tmThemes are overly verbose and difficult to maintain
- Themes are difficult to write from scratch

**The Solution**

What if all you needed to do to generate a theme was specify a few colors and everything else was handled for you? Well that's what this module aims to accomplish. All you need to do is specify a set of "base colors" (background, foreground and 4 accent colors) and you have a reasonably good looking theme.

All other VS Code theme colors are then derived from those base colors, with the option to tweak each underlying color as well.

## Support

Support below means that the editor has explicit support for the languages; the colors should match their meanings. Other languages will probably still look alright but there is no guarentee that they will.

| Language | VS Code |
|---|---|
| CSS | :white_check_mark:
| JavaScript | :white_check_mark:
| HTML | :white_check_mark:
| TypeScript | :white_check_mark:

## Usage

```bash
npm run dev

# In another shell
npm start
```

Them in VS Code press <kbd>F5</kbd> to launch the debugger with the generated theme available to switch to.
