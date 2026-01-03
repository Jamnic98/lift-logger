import { BASE_URL } from 'config/env'
import type { Template, TemplateInput } from 'types/template'

const url = BASE_URL + '/templates'

export const getAllTemplates = async (): Promise<Template[]> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch templates')
  return res.json()
}

export const getTemplateById = async (id: string): Promise<Template> => {
  const res = await fetch(`${url}/${id}`)
  if (!res.ok) throw new Error('Template not found')
  return res.json()
}

export const createTemplate = async (data: TemplateInput): Promise<Template> => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create template')
  return res.json()
}

export const updateTemplate = async (
  id: string,
  data: Partial<TemplateInput>
): Promise<Template> => {
  const res = await fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update template')
  return res.json()
}

export const deleteTemplate = async (id: string): Promise<void> => {
  const res = await fetch(`${url}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete template')
}
