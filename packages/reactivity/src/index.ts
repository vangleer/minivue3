import { reactive } from './reactivity'
import { effect } from './effect'
const obj = {
  name: '小黄',
  age: 12
}
const pObj = reactive(obj)
effect(() => {
  pObj.name = Math.random()
  console.log('执行', pObj.name)
})

setTimeout(() => {
  pObj.name = '大黄'
}, 2000)




