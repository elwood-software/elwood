'use client';

import {useEffect} from 'react';

export default function Page() {
  useEffect(() => {
    document.querySelector<HTMLButtonElement>('#download-button')?.click();
  }, []);

  return <span />;
}
