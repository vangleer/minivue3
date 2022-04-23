export const isObject = value => {
  return typeof value === 'object' && value !== null
}

export const isFunction = value => {
  return typeof value === 'function'
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