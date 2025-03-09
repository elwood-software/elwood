import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Input } from "#/components/ui/input";
import { Button, ButtonProps } from "#/components/ui/button";
import { type Action, useAction } from "#/hooks/use-action";

export type ActionButtonProps = ButtonProps & {
  namespace: string;
  bucket: string;
  path: string;
  action: Action;
};

export function ActionButton(props: PropsWithChildren<ActionButtonProps>) {
  const { action, namespace, bucket, path, ...buttonProps } = props;
  const [open, setOpen] = useState(false);
  const mutation = useAction();
  const form = useForm<any>({
    defaultValues: (action.form ?? []).reduce((acc, item) => {
      return {
        ...acc,
        [item.name]: item.defaultValue ?? "",
      };
    }, {}),
  });

  function handleActionClick(data: Record<string, any>) {
    mutation.mutate(
      {
        namespace,
        bucket,
        path,
        type: action.type,
        data,
      },
      {
        onSuccess({ data }) {
          setOpen(false);

          if (data.downloadUrl) {
            const a = document.createElement("a");
            a.href = data.downloadUrl;
            a.download = data.fileName ?? "";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        },
      },
    );
  }

  if (!action.form) {
    return (
      <form onSubmit={form.handleSubmit(handleActionClick)}>
        <Button loading={mutation.isPending} {...buttonProps} type="submit">
          {props.children ?? action.label}
        </Button>
      </form>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>{props.children ?? action.label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action.label}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleActionClick)}
            className="space-y-8"
          >
            {action.form.map((item) => {
              return (
                <FormField
                  key={`button-form-${path}-${item.name}`}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => {
                    let control = <></>;

                    switch (item.type) {
                      case "select": {
                        control = (
                          <Select>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder={item.defaultValue} />
                            </SelectTrigger>
                            <SelectContent>
                              {item.options?.map((opt) => {
                                return (
                                  <SelectItem
                                    key={`${item.name}-${opt.name}`}
                                    value={opt.name}
                                  >
                                    {opt.value}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        );
                        break;
                      }

                      default: {
                        control = <Input required={item.required} {...field} />;
                      }
                    }

                    return (
                      <FormItem>
                        <FormLabel>{item.label}</FormLabel>
                        <FormControl>{control}</FormControl>
                        {item.help && (
                          <FormDescription>{item.help}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              );
            })}
            <Button loading={mutation.isPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
