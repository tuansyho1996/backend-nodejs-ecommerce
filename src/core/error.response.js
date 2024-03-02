'use strict'

import ReasonPhrases from '../utils/reasonPhrases.js'
import statusCodes from '../utils/statusCodes.js'

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

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, status = statusCodes.UNAUTHORIZED) {
    super(message, status)
  }
}

export {
  ConflictRequstError,
  BadRequestError,
  AuthFailureError
}