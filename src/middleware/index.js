'use strict'
import Logger from '../logger/discord.logger.js'
const pushToLogDiscord = async (req, res, next) => {
  try {
    await Logger.sendMessage(req.get('host'))
  } catch (error) {
    next(error)
  }
}
export {
  pushToLogDiscord
}