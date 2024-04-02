import {type ReactNode, useState, type FormEvent, useRef} from 'react';
import {useList, useClickAway} from 'react-use';
import {toArray} from '@elwood/common';
import {Spinner} from '@elwood/ui';
import {type Member} from '@elwood/common';
import {clsx} from 'clsx';
import {useSearchMembers} from '@/data/members/use-search-members';

export interface UseMemberSearchInputItem {
  type: 'email' | 'member';
  value: string;
  label: ReactNode;
}

export function useMemberSearchInput(): [
  JSX.Element,
  UseMemberSearchInputItem[],
] {
  const ref = useRef(null);
  const [value, setValue] = useState('');
  const [items, {push, removeAt}] = useList<UseMemberSearchInputItem>([]);
  const query = useSearchMembers({query: value});
  const suggestions = toArray(query.data).filter(item => {
    return !items.some(i => i.value === item.username);
  });

  useClickAway(ref, () => {
    setValue('');
  });

  function onSubmit(e: FormEvent): void {
    e.preventDefault();

    if (value.includes('@')) {
      push({
        type: 'email',
        value,
        label: value,
      });

      setValue('');
    }
  }

  function onSelect(item: Member): void {
    push({
      type: 'member',
      value: String(item.username),
      label: item.display_name,
    });
  }

  function onRemove(idx: number): void {
    removeAt(idx);
  }

  const element = (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className="bg-background border rounded py-2 px-3">
      <header className="flex items-center">
        {items.map((item, idx) => {
          return (
            <button
              type="button"
              onClick={() => {
                onRemove(idx);
              }}
              key={`entry-${item.value}`}
              className="text-xs py-1 px-3 bg-black leading-none border mr-1 rounded-full">
              {item.label}
            </button>
          );
        })}
        <input
          placeholder={
            items.length === 0 ? 'Add a @username or email' : undefined
          }
          onChange={e => {
            setValue(e.target.value);
          }}
          className="text-foreground flex-grow bg-transparent border border-transparent outline-none ring-0 min-w-[100px]"
          type="text"
          value={value}
        />
        <Spinner
          className={clsx(
            'transition-opacity',
            query.isLoading ? '' : 'opacity-0',
          )}
        />
      </header>
      {suggestions.length && value.length > 0 ? (
        <ol className="border-t mt-3 py-3">
          {suggestions.map(suggestion => {
            return (
              <li key={suggestion.username}>
                <button
                  onClick={() => {
                    onSelect(suggestion);
                  }}
                  type="button">
                  {suggestion.display_name}
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
    </form>
  );

  return [element, items];
}
