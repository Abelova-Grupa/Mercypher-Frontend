import React from 'react'

interface NewChatProp {
    ref : React.Ref<HTMLDivElement> | undefined
}

export default function NewChat({ref} : NewChatProp) {

  return (
    <div className="new-contact-popup flex flex-col absolute items-center " ref={ref}>
        <div className="w-[100%]">
        <p className="text-xl text-left ml-4 mt-2 ">New Chat</p>
        </div>
        <input className="border-1 border-[#ddd8d1] w-[90%] rounded-2xl mt-2 pl-2" type="text" />
        <button className="text-l w-[90%] h-[50px]">
            <div className='text-left flex items-center'>
                <img src="/account.svg" className='w-[32px] h-[32px]' alt="account" />
                <p className='ml-2'>New Contact</p>
            </div>
        </button>
        <button className="text-l w-[90%] h-[50px]" >
            <div className='text-left flex items-center'>
                <img src="/group.svg" className='w-[32px] h-[32px]' alt="account" />
                <p className='ml-2'>New Group</p>
   
            </div>
        </button>
    </div>
  )
}
