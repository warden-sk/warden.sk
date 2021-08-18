"use strict";
/*
 * Copyright 2021 Marek Kobida
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
class Html {
    assets;
    constructor(assets = []) {
        // from ['a'] to { name: 'a' }
        this.assets = assets.map(name => ({ name }));
    }
    apply(compiler) {
        const { RawSource } = webpack_1.default.sources;
        compiler.hooks.emit.tap(Html.name, compilation => {
            const assets = [...compilation.getAssets(), ...this.assets];
            const css = this.assetsToHTML(assets, /\.css$/, ({ name }) => `<link href="${name}" rel="stylesheet" />`);
            const js = this.assetsToHTML(assets, /\.js$/, ({ name }) => `<script src="${name}"></script>`);
            const html = `<!DOCTYPE html>
<html lang="sk">
  <head>
    ${css.join('\n    ')}
    <meta charset="utf-8" />
    <meta content="width=device-width" name="viewport" />
    <title>${compilation.name}</title>
  </head>
  <body>
    <div id="index"></div>
    ${js.join('\n    ')}
  </body>
</html>
`;
            compilation.emitAsset('index.html', new RawSource(html));
        });
    }
    assetsToHTML(assets, pattern, template) {
        return assets.filter(({ name }) => pattern.test(name)).map(template);
    }
}
exports.default = Html;
