
import _ from 'lodash'

const getInfoData = ({ filed, object }) => {
  return _.pick(object, filed)
}
// [a,b]=>{a:1,b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}
// [a,b]=>{a:0,b:0}
const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map(el => [el, 0]))
}
const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach(k => {
    if (obj[k] == null) {
      console.log('k', k)
      delete obj[k]
    }
  })
  return obj
}
const updateNestedObjectParse = object => {
  const obj = removeUndefinedObject(object)
  let final = {}
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParse(obj[k])
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a]
      })
    }
    else {
      final[k] = obj[k]
    }
  })
  return final
}
export {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParse
}