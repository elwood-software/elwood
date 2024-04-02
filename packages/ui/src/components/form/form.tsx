import {type FormEventHandler, type ReactNode} from 'react';
import * as Primitive from '@radix-ui/react-form';
import {clsx} from 'clsx';
import {Button} from '../button/button';
import {type Icon} from '../../svg/icons';
import {FormLabel} from './label';

export interface FormField {
  name: string;
  icon?: Icon;
  label: ReactNode;
  messages?: (Primitive.FormMessageProps & {icon?: Icon})[];
  control: ReactNode;
}

export interface FormProps {
  name: string;
  fields: FormField[];
  onSubmit?: FormEventHandler;
}

export function Form(props: FormProps): JSX.Element {
  return (
    <Primitive.Root onSubmit={props.onSubmit} className="space-y-6">
      {props.fields.map(field => {
        return (
          <Primitive.Field
            key={`FormField-${props.name}-${field.name}`}
            className="grid mb-[10px]"
            name={field.name}>
            <div className="flex items-baseline justify-between">
              <Primitive.Label asChild>
                <FormLabel className="mb-3 flex items-center">
                  {field.icon ? <field.icon className="w-3 h-3 mr-1" /> : null}
                  {field.label}
                </FormLabel>
              </Primitive.Label>
            </div>
            <Primitive.Control
              asChild
              className="bg-background border flex rounded items-center py-2 px-3 text-sm">
              {field.control}
            </Primitive.Control>
            <div>
              {field.messages?.map((message, index) => {
                const {
                  children,
                  icon: Icon,
                  className,
                  ...messageProps
                } = message;
                const cn = clsx(
                  className,
                  'text-xs flex items-center justify-start mt-1',
                );

                return (
                  <Primitive.Message
                    // eslint-disable-next-line react/no-array-index-key -- We don't have a unique key
                    key={`FormField-${props.name}-${field.name}-message-${index}`}
                    className={cn}
                    {...messageProps}>
                    {Icon ? <Icon className="w-3 h-3 mr-1" /> : null}
                    {children}
                  </Primitive.Message>
                );
              })}
            </div>
          </Primitive.Field>
        );
      })}

      {props.onSubmit ? (
        <Primitive.Submit asChild>
          <Button type="submit" variant="brand">
            Post question
          </Button>
        </Primitive.Submit>
      ) : null}
    </Primitive.Root>
  );
}
