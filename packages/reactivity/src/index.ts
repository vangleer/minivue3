import { reactive } from './reactivity'
const obj = {
  name: '小黄',
  age: 12
}

const pObj = reactive(obj)
const pObj2 = reactive(obj)


console.log(pObj, pObj2, pObj === pObj2, obj)