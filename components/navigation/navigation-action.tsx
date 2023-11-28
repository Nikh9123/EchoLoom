"use client"
import { Plus } from 'lucide-react'
import { ActionToolTip } from '@/components/action-tooltip'
import { Separator } from '../ui/separator'
import { useModal } from '@/hooks/use-modal-store'


export const NavigationAction = () => {
  const { onOpen, type } = useModal();
  return (
    <div>

      <ActionToolTip
        label='Create a server'
        side='right'
        align='center'
      >
        <button className=' group flex items-center'
          onClick={() => onOpen("createServer")}
        >
          <div className='flex mx-3 h-[48px] w-[48px] 
         rounded-[24px] group-hover:rounded-[16px]
          transition-all overflow-hidden items-center
          justify-center bg-background dark:bg-neutral-700
          group-hover:bg-emerald-500'>
            <Plus
              className='group-hover:text-white text-primary
          transition text-emerald-500'
              size={30}
            />
          </div>

        </button>
      </ActionToolTip>
    </div >
  )
}

