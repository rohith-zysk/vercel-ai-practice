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
