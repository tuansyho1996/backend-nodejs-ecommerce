'use strict'

const StatusCode = {
  OK: 200,
  CREATED: 201
}

const ReasonStatusCode = {
  OK: 'Success',
  CREATED: 'Created!'
}

class SuccessResponse {
  constructor({ message, statusCode, reasonStatusCode, metadata = {} }) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.metadata = metadata
  }
  send(res, headers = {}) {
    console.log('check this aa', this)
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata }) {
    console.log('check ok')
    super({ message, metadata, statusCode, reasonStatusCode })
  }
}

class CREATED extends SuccessResponse {
  constructor({ option, message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }) {
    super({ message, metadata, statusCode, reasonStatusCode })
    this.option = option
  }
}

export {
  OK,
  CREATED
}
