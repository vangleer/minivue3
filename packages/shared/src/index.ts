export const isObject = value => {
  return typeof value === 'object' && value !== null
}

export const isFunction = value => {
  return typeof value === 'function'
}

export const isString = value => {
  return typeof value === 'string'
}

export const isArray = Array.isArray

export const assign = Object.assign

export const forEach = (obj: Object | Array<any>, fn) => {
  if (!isObject(obj)) return console.warn('[vue-shared]: forEach first arg must obj Object OR Array')
  if (isArray(obj)) {
    obj.forEach(fn)
  } else {
    Object.keys(obj).forEach(key => {
      fn(key, obj[key])
    })
  }
}

export const enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}