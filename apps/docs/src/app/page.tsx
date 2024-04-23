import { RedirectType, redirect } from 'next/navigation'

export default function Page(): void {
  redirect('https://github.com/elwood-software/elwood', RedirectType.replace)
}
