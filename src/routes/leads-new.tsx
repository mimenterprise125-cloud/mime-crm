import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/leads-new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/leads-new"!</div>
}
