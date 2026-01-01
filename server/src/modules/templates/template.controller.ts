import { TemplateModel } from './template.model'
import type { Template, TemplateInput } from 'types/template'

export const createTemplate = async (data: TemplateInput): Promise<Template> =>
  (await TemplateModel.create(data)).toObject()

export const getTemplateById = async (id: string): Promise<Template | null> =>
  await TemplateModel.findById(id)

export const getAllTemplates = async (): Promise<Template[]> => await TemplateModel.find()

export const updateTemplate = async (
  id: string,
  data: Partial<TemplateInput>
): Promise<Template | null> =>
  await TemplateModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })

export const deleteTemplate = async (id: string): Promise<boolean> =>
  (await TemplateModel.findByIdAndDelete(id)) !== null
