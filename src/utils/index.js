'use strict'

import _ from 'lodash'

const getInfoData = ({ filed, object }) => {
  return _.pick(object, filed)
}
// [a,b]=>{a:1,b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}
// [a,b]=>{a:0,b:0}
const UnGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map(el => [el, 0]))
}
export {
  getInfoData,
  getSelectData,
  UnGetSelectData
}