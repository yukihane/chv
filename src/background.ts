import { FetchRequest, FetchResponse } from "./messages";

chrome.runtime.onMessage.addListener(
  (
    message: FetchRequest,
    sender,
    sendResponse: (response: FetchResponse) => void
  ) => {
    console.log(`url: ${message.url}`);
    fetch(message.url)
      .then((response) => response.text())
      .then((text) => {
        sendResponse({ text });
      });
    return true;
  }
);
