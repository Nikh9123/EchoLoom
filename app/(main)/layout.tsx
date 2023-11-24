import React, { ReactNode } from 'react'

type Props = {}

const Mainlayout = async({children}: {children : React.ReactNode}) => {
  return (
    <div className='h-full'>
      {children}
    </div>
  )
}

export default Mainlayout