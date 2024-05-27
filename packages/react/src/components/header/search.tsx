import {type ChangeEventHandler, type ReactNode, useState} from 'react';
import {SearchIcon, Spinner} from '@elwood/ui';

import clsx from 'clsx';

export type HeaderSearchResult = {
  title: string;
  items: Array<{
    id: string;
    value: ReactNode;
  }>;
};

export interface HeaderSearchProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  results: HeaderSearchResult[];
  loading?: boolean;
}

export function HeaderSearch(props: HeaderSearchProps): JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);
  const results = (Array.isArray(props.results) ? props.results : []).filter(
    item => item.items.length > 0,
  );
  const open =
    (hasFocus && (results.length > 0 || props.loading)) ||
    props.value.length > 0;

  const cl = clsx('flex items-center w-full h-full bg-transparent px-3', {
    'border-t border-l border-r rounded-t': open,
    'border rounded': !open,
  });

  return (
    <form className="w-full h-full relative">
      <div className={cl}>
        <SearchIcon className="size-[1em] mr-3 stroke-muted-foreground" />
        <input
          type="search"
          className="flex w-full h-full bg-transparent outline-none ring-foreground placeholder:muted-foreground"
          placeholder="Search"
          defaultValue={props.value}
          onChange={props.onChange}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
      </div>
      {open && (
        <div className="absolute top-full w-full border-l border-r border-b rounded-b bg-background p-3 pt-0">
          <div className="border-t pt-3">
            {props.loading && <Spinner size="sm" muted />}
            {results.length === 0 && !props.loading && (
              <div className="text-muted-foreground">No results found</div>
            )}
            {results.map(group => {
              return (
                <div>
                  <header>{group.title}</header>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );
}
