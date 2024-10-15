import React from 'react'
import ReusablePriorityPage from '../reusablePriorityPage'
import { Priority } from '@/src/state/api'

const Low = () => {
  return (
    <ReusablePriorityPage priority={Priority.Low}/>
  )
}

export default Low