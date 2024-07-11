import {JsonObject} from '@elwood/common';
import {type Workflow} from '@jsr/elwood__run';
import {ReactNode} from 'react';

export type RunDisplayNameProps = {
  primary: JsonObject | null | undefined;
  fallback: JsonObject | null | undefined;
  className?: string;
  postfix?: ReactNode;
};

export function RunDisplayName(props: RunDisplayNameProps) {
  const {primary, fallback} = props;

  if (!primary && !fallback) {
    return <>(unknown)</>;
  }

  let name = '(unknown)';

  if (props.primary?.label) {
    name = props.primary.label;
  } else if (props.primary?.name) {
    name = props.primary?.name;
  } else if (props.fallback?.name) {
    name = props.fallback.name;
  } else if (props.fallback?.name) {
    name = props.fallback.name;
  }

  return (
    <span className={props.className}>
      {name}
      {props.postfix && (
        <span className="ml-2 text-lg text-muted-foreground font-normal">
          {props.postfix}
        </span>
      )}
    </span>
  );
}
