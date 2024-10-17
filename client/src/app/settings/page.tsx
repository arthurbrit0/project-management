import Header from '@/src/components/Header'
import React from 'react'


const Settings = () => {
    const userSettings = {
        username: "johndoe",
        email: "john.doe@example.com",
        teamName: "Development Team",
        roleName:  "Developer"
    }

    const labelStyles = "block text-sm font-medium dark:text-white"
    const textStyles = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white"

  return (
    <div className="p-8">
        <Header name="Configurações" />
        <div className="space-y-4">
            <div>
                <label className={labelStyles} htmlFor="username">Nome de usuário</label>
                <input type="text" id="username" className={textStyles} value={userSettings.username} />
            </div>
            <div>
                <label className={labelStyles} htmlFor="email">Email</label>
                <input type="email" id="email" className={textStyles} value={userSettings.email} />
            </div>
            <div>
                <label className={labelStyles} htmlFor="team">Time</label>
                <input type="text" id="team" className={textStyles} value={userSettings.teamName} />
            </div>
            <div>
                <label className={labelStyles} htmlFor="role">Função</label>
                <input type="text" id="role" className={textStyles} value={userSettings.roleName} />
            </div>
        </div>
    </div>
  )
}

export default Settings