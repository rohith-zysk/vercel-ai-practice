'use client'

import { useState } from 'react'
import { streamComponent } from '../actions/basic-rsc-action'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>() // State holds/stores the component that is being streamed.
  const [prompt, setPrompt] = useState('')

  return (
    <div className='max-w-5xl mx-auto px-4 xl:px-0'>
      <div className='mx-auto mt-4'>
        <Alert>
          <Terminal className='h-4 w-4' />
          <AlertTitle>This is a demo on RSC</AlertTitle>
          <AlertDescription>
            The model will stream a weather component if the prompt is regarding
            weather.
          </AlertDescription>
        </Alert>
      </div>
      {component ? (
        <div className='mt-12  pb-24 h-[300px] '>{component}</div> // Rendering the component that is being streamed
      ) : (
        <div className='h-[300px] mt-12 bg-gray-200 mx-auto rounded-md'></div>
      )}

      {/* This is just a demo, so ignore UI and how it is implemented. Focusing mainly on server actions */}
      <div className='fixed bottom-8 left-1/2 '>
        <Input
          type='text'
          placeholder='Stream a component using react RSC'
          name='prompt'
          id='prompt'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className='w-[18rem] md:w-[25rem]  rounded-md bg-slate-50 '
          style={{
            transform: 'translate(-50%,0%)',
          }}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              const result = await streamComponent(prompt) // Calling server action ie. Actions are functions that run on the server.
              setPrompt('')
              setComponent(result) // setting the component recieved from the server.
            }
          }}
        />
      </div>
    </div>
  )
}
