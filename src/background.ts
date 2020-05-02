import iconv from "iconv-lite";
import { FetchRequest, FetchResponse } from "./messages";

chrome.runtime.onMessage.addListener(
  (
    message: FetchRequest,
    sender,
    sendResponse: (response: FetchResponse) => void
  ) => {
    console.log(`url: ${message.url}`);
    fetch(message.url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        iconv.decode(new Buffer(arrayBuffer), "Shift_JIS").toString()
      )
      .then((text) => {
        sendResponse({ text });
      });
    return true;
  }
);
