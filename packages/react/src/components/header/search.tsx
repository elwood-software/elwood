import {
  type ReactNode,
  type MouseEvent,
  useState,
  useEffect,
  useRef,
} from 'react';
import {Icon, SearchIcon, Spinner, XIcon} from '@elwood/ui';

import clsx from 'clsx';

export type HeaderSearchResult = {
  icon?: Icon;
  title: ReactNode;
  items: Array<{
    id: string;
    icon?: Icon;
    superTitle?: ReactNode;
    title: ReactNode;
    subTitle?: ReactNode;
    href?: string;
  }>;
};

export interface HeaderSearchProps {
  value: string;
  onChange: (value: string) => void;
  results: HeaderSearchResult[];
  loading?: boolean;
}

export function HeaderSearch(props: HeaderSearchProps): JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const results = (Array.isArray(props.results) ? props.results : []).filter(
    item => item.items.length > 0,
  );
  const open = hasFocus;

  useEffect(() => {
    function cb() {
      console.log('cc');
      setHasFocus(false);
    }
    window.addEventListener('click', cb);
    return function unload() {
      window.removeEventListener('click', cb);
    };
  }, [document.body]);

  function onFormClick(e: MouseEvent<HTMLElement>) {
    if (
      (e.target as HTMLAnchorElement).parentElement?.tagName.toUpperCase() !==
        'A' &&
      (e.target as HTMLAnchorElement).parentElement?.tagName.toUpperCase() !==
        'BUTTON'
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  const cl = clsx('flex items-center w-full h-full bg-transparent px-3 group', {
    'border border-b-transparent rounded-t': open,
    'border rounded': !open,
  });

  return (
    <>
      <form className="w-full h-full relative" onClick={onFormClick}>
        <div className={cl}>
          <SearchIcon
            className={clsx(
              'size-[1em] mr-3',
              props.value.length > 0
                ? 'text-foreground'
                : 'text-muted-foreground',
            )}
            stroke="currentColor"
            onClick={() => {
              ref.current?.focus();
            }}
          />
          <input
            ref={ref}
            type="search"
            className="flex w-full h-full bg-transparent outline-none ring-foreground placeholder:muted-foreground appearance-none"
            placeholder="Search"
            defaultValue={props.value}
            onChange={e => props.onChange(e.target.value)}
            onFocus={() => {
              setHasFocus(true);
            }}
          />
          {props.value.length > 0 && (
            <button
              type="button"
              onClick={() => {
                props.onChange('');
              }}>
              <XIcon className="size-[1em] ml-3 stroke-muted-foreground" />
            </button>
          )}
        </div>
        {open && (
          <div className="absolute top-full w-full border-l border-r border-b rounded-b bg-background p-3 pt-0 z-50">
            <div className="border-t pt-3 px-1">
              {props.loading && results.length === 0 && (
                <Spinner size="sm" muted />
              )}
              {results.length === 0 && !props.loading && (
                <div className="text-muted-foreground">No results found</div>
              )}
              <div className="space-y-6">
                {results.map(group => {
                  return (
                    <div className={`Search-${group}`}>
                      <header className="text-sm text-muted-foreground mb-1 font-semibold flex items-center">
                        {group.icon && (
                          <group.icon className="mr-1 size-3 text-muted-foreground" />
                        )}
                        <span>{group.title}</span>
                      </header>
                      <ul className="space-y-1.5 text-md">
                        {group.items.map(item => {
                          return (
                            <li
                              key={`Search-${group.title}-${item.id}`}
                              className="flex items-center">
                              {item.icon && (
                                <item.icon
                                  className="mr-2 size-3.5 text-muted-foreground"
                                  fill="currentColor"
                                />
                              )}
                              <div className="flex flex-col text-sm">
                                {item.superTitle && (
                                  <span className="text-xs text-muted-foreground">
                                    {item.superTitle}
                                  </span>
                                )}
                                <span>{item.title}</span>
                                {item.subTitle && (
                                  <span className="text-xs text-muted-foreground">
                                    {item.subTitle}
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
}
