'use strict'

import logger from '../logger/winston.logger.js'
import ReasonPhrases from '../utils/reasonPhrases.js'
import statusCodes from '../utils/statusCodes.js'
import mylogger from '../logger/mylogger.logger.js'

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
    // logger.error(`${this.status} ${this.message}`)
    // mylogger.error(
    //   this.message,
    //   ['/api/login', 'UUUAAA', { error: 'Bad request error' }]
    // )
  }
}

class ConflictRequestError extends ErrorResponse {
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

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, status = statusCodes.NOT_FOUND) {
    super(message, status)
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, status = statusCodes.FORBIDDEN) {
    super(message, status)
  }
}

export {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError
}