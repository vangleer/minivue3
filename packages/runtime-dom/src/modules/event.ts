export function patchEvent(el, eventName, nextValue) {
  // 先移除事件，再绑定事件

  let invokers = el._vei || (el._vei = {})

  const exists = invokers[eventName]
  if (exists && nextValue) {
    exists.value = nextValue
  } else {
    let event = eventName.slice(2).toLowerCase()

    if (nextValue) {
      const invoker = invokers[eventName] = createInvoker(nextValue)
      el.addEventListener(event, invoker)
    } else if (exists) {
      document.removeEventListener(event, exists)
    }
  }
}
function createInvoker(callback) {
  const invoker = (e) => invoker.value(e)
  invoker.value = callback
  return invoker
}
