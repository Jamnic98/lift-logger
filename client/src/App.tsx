import { Routes, Route } from 'react-router-dom'
import {
  Dashboard,
  TemplateList,
  TemplateCreate,
  WorkoutOverview,
  WorkoutRun,
  WorkoutView,
} from 'pages'
import TemplateEdit from 'pages/TemplateEdit'

export default function App() {
  return (
    <Routes>
      {/* Root Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Templates */}
      <Route path="templates">
        <Route index element={<TemplateList />} />
        <Route path="create" element={<TemplateCreate />} />
        <Route path="edit/:templateId" element={<TemplateEdit />} />
      </Route>

      {/* Workouts */}
      <Route path="workouts">
        <Route index element={<WorkoutOverview />} />
        <Route path=":workoutId" element={<WorkoutView />} />
        <Route path="run/:templateId" element={<WorkoutRun />} />
      </Route>
    </Routes>
  )
}
