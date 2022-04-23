export const nodeOps = {
  insert(child, parent, anchor = null) { // 插入
    parent.insertBefore(child, anchor)
  },
  remove(child: HTMLElement) { // 删除
    const parent = child.parentNode
    parent?.removeChild(child)
  },
  setElementText(el: HTMLElement, text) {
    el.textContent = text
  },
  setText(node: Node, text) {
    node.nodeValue = text
  },
  querySelector(selector) {
    document.querySelector(selector)
  },
  parentNode(node: Node) {
    return node.parentNode
  },
  nextSibling(node: Node) {
    return node.nextSibling
  },
  createElement(tagName) {
    return document.createElement(tagName)
  },
  createText(text) {
    return document.createTextNode(text)
  }
}