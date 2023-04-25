import fetch from "node-fetch";

class Selector {
  #elements;
  constructor(elements: NodeListOf<Element>) {
    this.#elements = elements;
  }
  html(contents: string) {
    this.#elements.forEach((element) => {
      element.innerHTML = contents;
    });
  }
  on<K extends keyof HTMLElementEventMap>(
    eventName: K,
    callback: (event: HTMLElementEventMap[K]) => void
  ) {
    this.#elements.forEach((element) => {
      // would want a type guard to check whether something is
      // an HTMLElement (vs a Element)
      const htmlElem = element as HTMLElement;
      htmlElem.addEventListener(eventName, callback);
    });
  }

  show() {
    this.#elements.forEach((element) => {
      // would want a type guard to check whether something is
      // an HTMLElement (vs a Element)
      const htmlElem = element as HTMLElement;
      htmlElem.style.visibility = "visible";
    });
  }
  hide() {
    this.#elements.forEach((element) => {
      // would want a type guard to check whether something is
      // an HTMLElement (vs a Element)
      const htmlElem = element as HTMLElement;
      htmlElem.style.visibility = "hidden";
    });
  }
}

function $(selector: string) {
  return new Selector(document.querySelectorAll(selector));
}

namespace $ {
  export function ajax({
    url,
    success,
  }: {
    url: string;
    success: (result: any) => void;
  }): any {
    return fetch(url)
      .then((resp) => resp.json())
      .then(success);
  }
}

export default $;

$.ajax({
  url: "https://jsonplaceholder.typicode.com/posts/33",
  success: (result) => {
    $("#post-info").html("<strong>" + result.title + "</strong>" + result.body);
  },
});
