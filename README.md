# Vercel AI SDK Demo

Project to learn and gain hands on experience on how Vercel AI SDK works.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`OPENAI_API_KEY`=xxxxxxxxxxxx

## Installation

Install with npm

```bash
npm i
```

Run the project : localhost:3000/

```bash
npm run dev
```

## Tech Stack

**Client:** React, TailwindCSS, ShadcnUI

**Server:** React Server Actions, Vercel AI ai/core, Vercel AI ai/rsc

## Examples -> Streaming React Component

### React Server Action

```typescript
'use server'

// OpenAI SDK
import { openai } from '@ai-sdk/openai'

// The package responsible for streaming react server components.
import { streamUI } from 'ai/rsc'

// Zod for schema validation
import { z } from 'zod'

// This is the loading component that is streamed to the client until the actual task/tool is executed.
const LoadingComponent = () => (
  <div className='animate-pulse p-4 '>Getting weather...</div>
)

// The task that tool invokes.
const getWeather = async (location: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return '82°F️ ☀️'
}

interface WeatherProps {
  location: string
  weather: string
}

// The component that is streamed once the weather is fetched.
const WeatherComponent = (props: WeatherProps) => (
  <div className='border border-neutral-200 p-4 rounded-lg w-full '>
    The weather in {props.location} is {props.weather}
  </div>
)

// The function responsible for prompting OpenAI and returning response as a react server component
export async function streamComponent(prompt: string) {
  const result = await streamUI({
    model: openai('gpt-4o-mini'), // Make sure to use only gpt-40-mini
    prompt: prompt,
    text: ({ content }) => <div>{content}</div>, //Invoked and content is returned when the prompt is not regarding weather.

    // Invoked when the prompt is regarding the weather of any place
    tools: {
      getWeather: {
        description: 'Get the weather for a location', // Description is used to give information to the model about what the tool is supposed to do. This helps the model choose the appropriate tool for the task that has to be performed
        parameters: z.object({
          location: z.string(),
        }),
        generate: async function* ({ location }) {
          yield <LoadingComponent /> // Loading component until weather is fetched
          const weather = await getWeather(location)
          return <WeatherComponent weather={weather} location={location} /> // Streamed react component when fetch is complete.
        },
      },
    },
  })

  return result.value
}
```

###

React client

```typescript
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
```

## Documentation

[Documentation](https://sdk.vercel.ai/docs/ai-sdk-rsc/streaming-react-components)
