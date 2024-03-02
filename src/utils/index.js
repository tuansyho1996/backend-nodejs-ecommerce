'use strict'

import _ from 'lodash'

const getInfoData = ({ filed, object }) => {
  return _.pick(object, filed)
}

export default getInfoData