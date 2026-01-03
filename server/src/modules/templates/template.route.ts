import { Router } from 'express'
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
} from './template.controller'

const router = Router()

// create template
router.post('/', async (req, res, next) => {
  try {
    const template = await createTemplate(req.body)
    res.status(201).json(template)
  } catch (error) {
    next(error)
  }
})

// fetch all templates
router.get('/', async (_req, res, next) => {
  try {
    const templates = await getAllTemplates()
    res.json(templates)
  } catch (error) {
    next(error)
  }
})

// fetch template by id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const template = await getTemplateById(id)

    if (!template) {
      return res.status(404).json({ message: 'Template not found' })
    }

    res.json(template)
  } catch (error) {
    next(error)
  }
})

// update template
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const updatedTemplate = await updateTemplate(id, req.body)

    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found' })
    }

    res.json(updatedTemplate)
  } catch (error) {
    next(error)
  }
})

// delete template
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await deleteTemplate(id)

    if (!deleted) {
      return res.status(404).json({ message: 'Template not found' })
    }

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

export default router
