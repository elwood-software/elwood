import type {
  PropsWithChildren,
  ReactNode,
  ComponentPropsWithoutRef,
} from 'react';
import {type LucideIcon} from 'lucide-react';
import {
  DropdownMenuBase,
  DropdownMenuBaseTrigger,
  DropdownMenuBasePortal,
  DropdownMenuBaseContent,
  DropdownMenuBaseSeparator,
  DropdownMenuBaseItem,
  DropdownMenuBaseLabel,
  DropdownMenuBaseRadioGroup,
  DropdownMenuBaseRadioItem,
} from './dropdown-menu-base';

export interface DropdownMenuItemSeparator {
  id: string;
  type: 'separator';
}

export interface DropdownMenuItemLabel {
  id: string;
  type: 'label';
  icon?: LucideIcon;
  children: ReactNode;
}

export interface DropdownMenuItemItem
  extends ComponentPropsWithoutRef<typeof DropdownMenuBaseItem> {
  id: string;
  type?: never;
  children: ReactNode;
  disabled?: boolean;
  icon?: LucideIcon;
}

export interface DropdownMenuItemRadio
  extends ComponentPropsWithoutRef<typeof DropdownMenuBaseRadioGroup> {
  id: string;
  type: 'radio';
  items: ComponentPropsWithoutRef<typeof DropdownMenuBaseRadioItem>[];
}

export type DropdownMenuItem =
  | DropdownMenuItemSeparator
  | DropdownMenuItemItem
  | DropdownMenuItemLabel
  | DropdownMenuItemRadio;

export interface DropdownMenuProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuBase> {
  items: DropdownMenuItem[];
  contentClassName?: string;
}

export function DropdownMenu(
  props: PropsWithChildren<DropdownMenuProps>,
): JSX.Element {
  const {items = [], ...rootProps} = props;
  return (
    <DropdownMenuBase {...rootProps}>
      <DropdownMenuBaseTrigger asChild>
        {props.children}
      </DropdownMenuBaseTrigger>

      <DropdownMenuBasePortal>
        <DropdownMenuBaseContent className={props.contentClassName}>
          {items.map(item => {
            if (item.type === 'separator') {
              return <DropdownMenuBaseSeparator key={`separator-${item.id}`} />;
            }

            if (item.type === 'label') {
              return (
                <DropdownMenuBaseLabel
                  key={`label-${item.id}`}
                  className="flex items-center">
                  {item.icon ? <item.icon className="w-4 h-4 mr-2" /> : null}
                  {item.children}
                </DropdownMenuBaseLabel>
              );
            }

            if (item.type === 'radio') {
              const i = item;

              return (
                <DropdownMenuBaseRadioGroup
                  key={`radio-${i.id}`}
                  value={i.value}
                  onValueChange={i.onValueChange}>
                  {item.items.map(radioItem => {
                    return (
                      <DropdownMenuBaseRadioItem
                        key={`radio-${i.id}-${radioItem.value}`}
                        {...radioItem}
                      />
                    );
                  })}
                </DropdownMenuBaseRadioGroup>
              );
            }

            const {children, id, ...itemProps} = item;

            return (
              <DropdownMenuBaseItem {...itemProps} key={`DropdownMenu-${id}`}>
                {item.icon ? <item.icon className="w-4 h-4 mr-2" /> : null}
                {children}
              </DropdownMenuBaseItem>
            );
          })}
        </DropdownMenuBaseContent>
      </DropdownMenuBasePortal>
    </DropdownMenuBase>
  );
}
