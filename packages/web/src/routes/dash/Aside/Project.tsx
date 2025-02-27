import Button from '../../../components/elements/Button'
import { useCallback } from 'react'
import { useProjectByParams } from '../Project/useProjectByParams'
import { useSelectedProject } from '../../../components/SelectProject/useSelectedProject'
import { useNavigate } from 'react-router-dom'

export default function Project() {
  const { project } = useProjectByParams()
  const { setSelectedProject } = useSelectedProject()
  const navigate = useNavigate()

  const onClick = useCallback(() => {
    setSelectedProject(project)
    navigate('/build')
  }, [setSelectedProject, project, navigate])

  return <div>
    <Button onClick={onClick} h="secondary" className="!h-auto !whitespace-normal">{`Deploy new ${project.name} vault ->`}</Button>
  </div>
}
