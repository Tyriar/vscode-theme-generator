# editor-theme-generator

An early proof of concept of a program that can generate theme files for editors (well anything really), based on a set of colors. The benefit of this is that instead of building a new .tmTheme for example, there can be a single source of truth. This single source of truth could work out all the kinks for various languages for each editor and its grammar such that when someone wants to create a new editor would do is to just fill in the colors they want. Instead of further fragmenting the tmTheme situation by creating or forking a theme.

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
npm install
npm run build && npm start
```

To test VS Code extensions, <kbd>F5</kbd> will launch the Code debugger with the theme available to switch to.
