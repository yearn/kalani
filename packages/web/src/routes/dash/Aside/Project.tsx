import Button from '../../../components/elements/Button'
import { useCallback } from 'react'
import { useProjectByParams } from '../Project'
import { useSelectedProject } from '../../../components/SelectProject'
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
    <Button onClick={onClick} h="secondary">{'Deploy a new vault ->'}</Button>
  </div>
}
