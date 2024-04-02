import {type ReactNode} from 'react';
import * as Primitive from '@radix-ui/react-switch';
import {clsx} from 'clsx';
import {InfoIcon} from '../../svg/icons';
import {Tooltip} from '../tooltip/tooltip';

export interface SwitchProps {
  name: string;
  label: ReactNode;
  className?: string;
  info?: ReactNode;
  onChange: (checked: boolean) => void;
  checked?: boolean;
}

export function Switch(props: SwitchProps): JSX.Element {
  return (
    <div className={clsx(props.className, 'flex items-center')}>
      <div className="flex items-center">
        <label
          className="text-foreground leading-none select-none"
          htmlFor={props.name}>
          {props.label}
        </label>
        {props.info ? (
          <Tooltip label={props.info}>
            <InfoIcon className="w-4 h-4 ml-2 fill-muted text-background" />
          </Tooltip>
        ) : null}
      </div>

      <Primitive.Root
        checked={props.checked}
        onCheckedChange={props.onChange}
        className="switch w-[42px] h-[25px] bg-background border rounded-full relative data-[state=checked]:bg-foreground/50 outline-none cursor-default"
        id={props.name}>
        <Primitive.Thumb className="block w-[21px] h-[21px] bg-outline rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px]" />
      </Primitive.Root>
    </div>
  );
}
