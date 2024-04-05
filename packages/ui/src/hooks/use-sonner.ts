import {toast, type ExternalToast} from 'sonner';

type ToastTypes =
  | 'normal'
  | 'action'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'loading'
  | 'default';

type ToastFn = (
  message: string,
  opts?: ExternalToast & {type?: ToastTypes},
) => ReturnType<typeof toast>;

export function useSonner(): ToastFn {
  return function sonner(message, opts = {}): ReturnType<typeof toast> {
    return toast(message, opts);
  };
}
