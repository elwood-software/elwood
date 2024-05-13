import {type ReactNode} from 'react';
import * as Primitive from '@radix-ui/react-tabs';

import {clsx} from 'clsx';
import {type Icon} from '../../svg/icons';

export interface TabsTab {
  id: string;
  label: string;
  content: ReactNode | JSX.Element | (() => JSX.Element);
  icon?: Icon;
  hidden?: boolean;
}

export interface TabsProps {
  defaultSelected?: string;
  selected?: string;
  tabs: TabsTab[];
  contentClassName?: string;
  tabClassName?: string;
  onChange?: (id: string) => void;
}

export function Tabs(props: TabsProps): JSX.Element {
  const defaultSelected = props.selected ?? props.tabs[0].id;

  const tabClassName = clsx(
    props.tabClassName,
    'py-3 mr-3 pr-3 cursor-pointer',
    'text-foreground/75 text-sm font-semibold',
    'flex items-center justify-start leading-none select-none outline-none cursor-default',
    'data-[state=active]:text-foreground data-[state=active]:focus:relative data-[state=active]:shadow-[inset_0_-1px_0_0,0_0.5px_0_0] data-[state=active]:shadow-current',
  );

  const contentClassName = clsx(props.contentClassName, 'grow outline-none');

  return (
    <Primitive.Root
      className="flex flex-col"
      defaultValue={defaultSelected}
      value={props.selected}
      onValueChange={props.onChange}>
      <Primitive.List className="shrink-0 flex border-b" aria-label="">
        {props.tabs.map(tab => {
          if (tab.hidden) {
            return <span key={`Tab${tab.id}`} />;
          }

          return (
            <Primitive.Trigger
              key={`Tab${tab.id}`}
              className={tabClassName}
              value={tab.id}>
              {tab.icon ? <tab.icon className="w-3 h-3 mr-2" /> : null}
              {tab.label}
            </Primitive.Trigger>
          );
        })}
      </Primitive.List>
      {props.tabs.map(tab => {
        return (
          <Primitive.Content
            key={`TabContent${tab.id}`}
            className={contentClassName}
            value={tab.id}>
            {typeof tab.content === 'function' ? tab.content() : tab.content}
          </Primitive.Content>
        );
      })}
    </Primitive.Root>
  );
}
