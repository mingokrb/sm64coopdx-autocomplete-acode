"use strict";
(() => {
  // src/worker.ts
  function findTag(tag, content) {
    const openTagReg = new RegExp(`<${tag}(\\s[^>]*)?>`, "i");
    const closeTagReg = new RegExp(`</${tag}>`, "i");
    const lines = content.split("\n");
    let close = -1;
    let open = -1;
    let lang;
    for (let i = 0; i < lines.length; i++) {
      if (open < 0 && openTagReg.test(lines[i])) {
        open = i;
        const attrMatch = lines[i].match(/lang\s*=\s*["'](\w+)["']/);
        if (attrMatch) lang = attrMatch[1];
      } else if (open >= 0 && closeTagReg.test(lines[i])) {
        close = i;
        break;
      }
    }
    if (open >= 0 && close >= 0) return { open, close, lang };
    return null;
  }
  self.onmessage = (e) => {
    const content = e.data;
    const script = findTag("script", content);
    const style = findTag("style", content);
    self.postMessage({ script, style });
  };
})();
