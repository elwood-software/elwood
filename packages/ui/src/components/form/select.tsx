import {forwardRef, Fragment, type ReactNode} from 'react';
import * as Primitive from '@radix-ui/react-select';
import {clsx} from 'clsx';
import {CheckIcon, ChevronDownIcon, ChevronUpIcon} from '../../svg/icons';

export interface SelectItemProps {
  label: ReactNode;
  value: string;
  group?: string;
}

export interface SelectProps extends Primitive.SelectProps {
  items: SelectItemProps[];
  label?: string;
  placeholder: ReactNode;
  onChange: (value: string) => void;
  value?: string;
}

export const Select = forwardRef<typeof Primitive.Root, SelectProps>(
  function Select(props, _forwardRef): JSX.Element {
    const groups = [
      ...new Set(
        props.items.reduce<string[]>((acc, item) => {
          return [...acc, item.group ?? 'none'];
        }, []),
      ),
    ];

    return (
      <Primitive.Root value={props.value} onValueChange={props.onChange}>
        <Primitive.Trigger
          className="inline-flex px-3 py-2 items-center justify-between rounded leading-none data-[placeholder]:text-muted outline-none border bg-background text-foreground"
          aria-label={props.label}>
          <Primitive.Value placeholder={props.placeholder} />
          <Primitive.Icon>
            <ChevronDownIcon />
          </Primitive.Icon>
        </Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Content className="overflow-hidden rounded-md border bg-sidebar">
            <Primitive.ScrollUpButton className="flex items-center justify-center h-[25px]cursor-default">
              <ChevronUpIcon />
            </Primitive.ScrollUpButton>
            <Primitive.Viewport className="p-[5px]">
              {groups.map((group, idx) => {
                const items = (
                  <div className="space-y-1 p-1">
                    {props.items.map(item => {
                      const groupName = item.group ?? 'none';

                      if (groupName === group) {
                        return (
                          <SelectItem
                            key={`SelectItem-${group}-${item.value}`}
                            value={item.value}>
                            {item.label}
                          </SelectItem>
                        );
                      }

                      return null;
                    })}
                  </div>
                );

                if (groups.length === 1) {
                  return (
                    <Fragment key={`SelectGroup${group}`}>{items}</Fragment>
                  );
                }

                return (
                  <Fragment key={`SelectGroup${group}`}>
                    {idx !== 0 && (
                      <Primitive.Separator className="h-[1px] bg-violet6 m-[5px]" />
                    )}

                    <Primitive.Group>
                      <Primitive.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
                        {group}
                      </Primitive.Label>
                    </Primitive.Group>
                  </Fragment>
                );
              })}
            </Primitive.Viewport>
            <Primitive.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
              <ChevronDownIcon />
            </Primitive.ScrollDownButton>
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    );
  },
);

const SelectItem = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Primitive.Item>
>(({children, className, ...props}, forwardedRef) => {
  return (
    <Primitive.Item
      className={clsx(
        'leading-none py-1 px-2 pl-6 rounded flex items-center relative select-none data-[disabled]:text-muted data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-foreground/10 data-[highlighted]:text-white',
        className,
      )}
      {...props}
      ref={forwardedRef}>
      <Primitive.ItemText>{children}</Primitive.ItemText>
      <Primitive.ItemIndicator className="absolute left-1 w-4 inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4" />
      </Primitive.ItemIndicator>
    </Primitive.Item>
  );
});

SelectItem.displayName = 'SelectItem';
