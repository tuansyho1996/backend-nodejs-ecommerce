'use strict'

import { asyncHandle } from "../../auth/checkAuth.js"

import express from 'express'
import CommentController from "../../controllers/comment.controller.js"
const router = express.Router()

router.post('', asyncHandle(CommentController.createComment))
router.get('', asyncHandle(CommentController.getCommentProduct))
router.delete('', asyncHandle(CommentController.deleteComment))

export default router