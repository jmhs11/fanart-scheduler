
import { ActivityForm } from '@/components/activity-form'
import Link from 'next/link'

async function getTemplates(){
  const res = await fetch('http://localhost:3001/templates')
  const templates = await res.json()

  return templates
}

export default async function Home() {
  const templates = await getTemplates();

  return (
    <>
      <ActivityForm templates={templates} />
    </>
  )
}
