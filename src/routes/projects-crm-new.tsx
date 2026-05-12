import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects-crm-new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects-crm-new"!</div>
}
