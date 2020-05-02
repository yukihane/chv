// 多くの場合最新50件のみを取得するリンクになっているので
// URLの /l50 を除去して全件表示する
const urlPattern = /\/l50$|\/L#sugar$/;
const href = window.location.href;
if (urlPattern.test(href)) {
  window.location.href = href.replace(urlPattern, "/");
}

const resPattern = /^\.\.\/test\/read\.cgi\/.+?\/.+?\/\d+$/;
const linkTags = document.getElementsByTagName("a");
for (const a of linkTags) {
  const link = a.getAttribute("href");
  if (link && resPattern.test(link)) {
    a.onclick = (e) => {
      e.preventDefault();
      insertRes(a, a.href);
    };
  }
}

const insertRes = (refNode: HTMLElement, link: string) => {
  fetch(link)
    .then((response) => response.text())
    .then((text) => {
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(text, "text/html");
      const content = htmlDocument.getElementsByClassName("thread").item(0);
      if (content) {
        insertAfter(content, refNode);
      }
    });
};

const insertAfter = (newNode: Element, referenceNode: HTMLElement) => {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
};
