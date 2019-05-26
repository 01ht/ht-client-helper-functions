/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
  Utility method that updates the page's open graph and Twitter card metadata.
  It takes an object as a parameter with the following properties:
  title | description | url | image.
  If the `url` is not specified, `window.location.href` will be used; for
  all other properties, if they aren't specified, then that metadata field will not
  be set.
  Example (in your top level element or document, or in the router callback):
      import { updateMetadata } from 'pwa-helpers/metadata.js';
      updateMetadata({
        title: 'My App - view 1',
        description: 'This is my sample app',
        url: window.location.href,
        image: '/assets/view1-hero.png'
      });
*/
export const getMetaDescriptionFromQuillObject = quillObject => {
  let description = "";
  if (quillObject.ops) {
    for (let part of quillObject.ops) {
      if (
        description.length < 120 &&
        part.insert &&
        typeof part.insert === "string" &&
        part.insert !== "\n"
      ) {
        description += ` ${part.insert}`;
      }
    }
  }
  return description;
};

export const updateMetadata = ({
  title,
  description,
  url,
  image,
  imageAlt,
  canonical
}) => {
  if (title) {
    document.title = title;
    _setMeta("property", "og:title", title);
  }

  if (description) {
    _setMeta("name", "description", description);
    _setMeta("property", "og:description", description);
  }

  if (description == "") {
    let element = document.head.querySelector(`meta[name="description"]`);
    if (element) document.head.removeChild(element);
  }

  if (image) {
    _setMeta("property", "og:image", image);
  }

  if (imageAlt) {
    _setMeta("property", "og:image:alt", imageAlt);
  } else {
    _setMeta("property", "og:image:alt", "");
  }

  url = canonical || url || window.location.href;
  _setMeta("property", "og:url", url);

  // Update canonical
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (linkCanonical) document.head.removeChild(linkCanonical);

  if (canonical) {
    let linkCanonical = document.createElement("link");
    linkCanonical.setAttribute("rel", "canonical");
    linkCanonical.setAttribute("href", canonical);
    document.head.appendChild(linkCanonical);
  }
};

function _setMeta(attrName, attrValue, content) {
  let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content || "");
}