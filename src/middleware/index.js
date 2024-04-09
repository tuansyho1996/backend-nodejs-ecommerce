'use strict'
import Logger from '../logger/discord.logger.js'
const pushToLogDiscord = async (req, res, next) => {
  try {
    // await Logger.sendToFormatCode(req.get('host'))
    Logger.sendToFormatCode({
      title: `Method:${req.method}`,
      code: req.method === 'GET' ? req.query : req.body,
      message: `${req.get('host')}${req.originalUrl}`
    })
    return next()
  } catch (error) {
    next(error)
  }
}
export {
  pushToLogDiscord
}