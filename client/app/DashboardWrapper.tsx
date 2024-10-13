import React, { ReactNode } from 'react'

const DashboardWrapper = ({children}: {children: ReactNode}) => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
        {/* sidebar */}
        sidebar
        <main className="flex w-full flex-col bg-gray-50 dark:bg-dark-bg md:pl-64">
            {/* navbar */}
            navbar
            {children}
        </main>
    </div>
  )
}

export default DashboardWrapper;