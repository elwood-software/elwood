import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type MouseEvent,
} from 'react';
import {Button, type ButtonProps, type ButtonButtonProps} from '@elwood/ui';
import {noOp} from '@elwood/common';
import {useProviderContext} from '../use-provider-context';

export interface UseUploadButtonInput
  extends Omit<ButtonProps, 'prefix' | 'href' | 'onClick' | 'type' | 'ref'> {
  prefix: string[];
}

export function useUploadButton(input: UseUploadButtonInput): JSX.Element {
  const {prefix, children = 'Upload', ...buttonProps} = input;
  const ref = useRef<HTMLInputElement>(null);
  const {uploadManager} = useProviderContext();
  const [isLoading, setIsLoading] = useState(false);
  const prefixAsString = prefix.join('/');

  useEffect(() => {
    function onFocus(): void {
      setIsLoading(false);
    }

    window.addEventListener('focus', onFocus);

    return function unload() {
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  function onClick(e: MouseEvent<HTMLButtonElement>): void {
    setIsLoading(true);
    e.preventDefault();
    ref.current && (ref.current.value = '');
    ref.current?.click();
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const [bucket, ...path] = input.prefix;

    for (const file of Array.from(e.target.files ?? [])) {
      uploadManager?.addFile({
        name: file.name,
        type: file.type,
        data: file,
        meta: {
          bucketName: bucket,
          objectName: [...path, file.name].join('/'),
          contentType: file.type,
        },
        source: 'Local',
        isRemote: false,
      });
    }

    uploadManager?.upload().then(noOp).catch(noOp).finally(noOp);

    setIsLoading(false);
  }

  return (
    <>
      <input
        className="fixed -top-96 -left-96"
        multiple
        name={`UploadFileInput-${prefixAsString}`}
        onChange={onChange}
        ref={ref}
        type="file"
      />
      <Button
        {...(buttonProps as ButtonButtonProps)}
        loading={isLoading}
        onClick={onClick}
        ref={undefined}
        type="button">
        {children}
      </Button>
    </>
  );
}
