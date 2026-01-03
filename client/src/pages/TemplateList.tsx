import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { /* Pencil ,*/ Play, Trash2 } from 'lucide-react'

import { Button } from 'components'
import { getAllTemplates, deleteTemplate } from 'api'
import type { Template } from 'types'

export default function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAllTemplates()
        setTemplates(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this template?')
    if (!confirmed) return

    try {
      await deleteTemplate(id)
      // Remove deleted template from state
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete template')
    }
  }

  if (loading) return <p>Loading templates...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Templates</h1>

      {templates.length ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(({ id, name }) => {
              return (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{name}</td>
                  <td className="border border-gray-300 p-2 space-x-2 text-center">
                    <Button onClick={() => navigate(`/workouts/run/${id}`)}>
                      <Play />
                    </Button>
                    {/* TODO:: Add edit feature */}
                    {/* <Button onClick={() => navigate(`/templates/${id}`)}>
                      <Pencil />
                    </Button> */}
                    <Button onClick={() => handleDelete(id)} variant="danger">
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <p>No templates found.</p>
      )}
      <Button onClick={() => navigate('/templates/create')} className="cursor-pointer">
        Create a Template
      </Button>
    </>
  )
}
