'use client';

import {redirect} from 'next/navigation';
import {useOrgs} from '@/hooks/use-orgs';
import {Placeholder} from '@/components/placeholder';

export default function Index(): JSX.Element {
  const {data: orgs = [], error, isLoading} = useOrgs();

  if (isLoading) {
    return <Placeholder />;
  }

  if (error) {
    return <div>Error!</div>;
  }

  if (orgs.length === 1) {
    redirect(`/${orgs[0].name}`);
  }

  if (orgs.length === 0) {
    return <div className="flex">no orgs</div>;
  }

  return <div className="flex">org selector</div>;
}
