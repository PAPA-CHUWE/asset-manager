import DashboardStatCard from '@/app/ui-components/DashboardStatCard'
import { FolderPlus, Layers, Users } from 'lucide-react'
import React from 'react'

const Home = () => {
  return (
    <div className='w-full md:h-[50vh] h-full'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <DashboardStatCard
          title='Total Assets'
          value={100}
          icon={<FolderPlus />}
          description='Total number of assets in the system'
        />
        <DashboardStatCard
          title='Total Users'
          value={100}
          icon={<Users />}
          description='Total number of users in the system'
        />
        <DashboardStatCard
          title='Total Departments'
          value={100}
          icon={<Layers />}
          description='Total number of departments in the system'
        />
        <DashboardStatCard
          title='Total Categories'
          value={100}
          icon={<FolderPlus />}
          description='Total number of categories in the system'
        />
      </div>
      <div className='w-full h-full flex gap-4 justify-between md:flex-row flex-col'>
        <div className='w-2/3  shadow-md rounded-md p-4 h-[380px] ring-1 ring-ring '></div>
        <div className='w-1/3  shadow-md rounded-md p-4 h-[380px] ring-1 ring-ring'></div>
      </div>
    </div>
  )
}

export default Home
