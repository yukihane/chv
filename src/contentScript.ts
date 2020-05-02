import { FetchRequest, FetchResponse } from "./messages";

// 多くの場合最新50件のみを取得するリンクになっているので
// URLの /l50 を除去して全件表示する
const urlPattern = /\/l50$|\/L#sugar$/;
const href = window.location.href;
if (urlPattern.test(href)) {
  window.location.href = href.replace(urlPattern, "/");
}

// include可能なリンク(レスアンカーリンク)のパターン
const resPattern = /^https?:\/\/.*?\.(5ch\.net|bbspink.com)\/test\/read\.cgi\/.+?\/\d+?\/[\d\-n]+$/;
// クッションページリンクのパターン
const cushionPattern = /^https?:\/\/(jump\.5ch\.net|(www\.)?pinktower\.com)\/\?/;

const modifyLinks = (element: Element) => {
  const linkTags = element.getElementsByTagName("a");
  for (const a of linkTags) {
    // レスアンカーリンクだった場合にはクリック時にレスを表示する
    if (resPattern.test(a.href)) {
      a.onclick = (e) => {
        e.preventDefault();
        insertRes(a, a.href);
      };
    }
    // クッションページを経由しないようにリンク書き換え
    a.href = a.href.replace(cushionPattern, "");
  }
};

const insertRes = (refNode: HTMLElement, link: string) => {
  chrome.runtime.sendMessage(
    { url: link } as FetchRequest,
    ({ text }: FetchResponse) => {
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(text, "text/html");
      const content = htmlDocument.getElementsByClassName("thread").item(0);
      if (content) {
        const resDisplay = createResDisplay(content)!;
        insertAfter(resDisplay, refNode);
      }
    }
  );
};

const createResDisplay = (content: Element) => {
  const div = document.createElement("div");
  const hideButton = document.createElement("input");
  hideButton.setAttribute("type", "button");
  hideButton.setAttribute("value", "↓非表示");
  hideButton.onclick = hideRes;
  const hideButtonBottom = document.createElement("input");
  hideButtonBottom.setAttribute("type", "button");
  hideButtonBottom.setAttribute("value", "↑非表示");
  hideButtonBottom.onclick = hideRes;

  div.appendChild(hideButton);
  div.appendChild(content);
  div.appendChild(hideButtonBottom);

  modifyLinks(div);

  return div;
};

const hideRes = (ev: MouseEvent) => {
  const target = ev.target as HTMLInputElement;
  const parent = target.parentElement!;
  parent.remove();
};

const insertAfter = (newNode: Node, referenceNode: HTMLElement) => {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
};

modifyLinks(document.documentElement);
