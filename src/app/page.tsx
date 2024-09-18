import { redirect } from 'next/navigation'

// For some reason my app is automatically routing me to /home when I am trying to access '/', so ignore this.
const page = () => {
  redirect('/home')
}

export default page
