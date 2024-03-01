'use strict'

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409
}

const ReasonStatusCode = {
  FORBIDDEN: 'Bad Request Error',
  CONFLICT: 'Conflict Error'
}

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequstError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, status = StatusCode.CONFLICT) {
    super(message, status)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
    super(message, status)
  }
}

export {
  ConflictRequstError,
  BadRequestError
}