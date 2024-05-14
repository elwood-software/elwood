import {RedirectType, redirect} from 'next/navigation';

export default function Page(): void {
  redirect('/docs', RedirectType.replace);
}
