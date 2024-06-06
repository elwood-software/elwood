import {PropsWithChildren, useState} from 'react';
import {
  BotIcon,
  Button,
  UserIcon,
  cn,
  Spinner,
  SparklesIcon,
  ChevronRightIcon,
} from '@elwood/ui';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Link} from '../link';

export type AssistantMessage = {
  id: string | number;
  text: string;
  role: 'user' | 'them' | 'assistant';
  from?: string;
  avatarUrl?: string;
  status: 'pending' | 'processing' | 'sent' | 'error';
};

export type AssistantProps = {
  messages: AssistantMessage[];
  className?: string;
  footerClassName?: string;
  onSubmit?(term: string): void;
};

export function Assistant(props: PropsWithChildren<AssistantProps>) {
  const [value, setValue] = useState('');

  return (
    <div className={cn(props.className, 'size-full flex flex-col')}>
      <header className="border-b flex items-center p-3">
        <div className="flex items-center font-medium">
          <SparklesIcon className="size-4 mr-3" />
          Assistant
        </div>
      </header>
      <div className="flex-grow overflow-auto space-y-3 p-3">
        {props.children}

        {props.messages.map(message => {
          return (
            <div
              key={`assistant-${message.id}`}
              className={cn(
                'flex',
                message.role === 'user' && 'text-muted-foreground',
              )}>
              <div className="mr-3">
                <div className="flex border rounded-full items-center justify-center text-muted-foreground p-1">
                  {message.role === 'user' && (
                    <UserIcon className="size-4 stroke-current" />
                  )}
                  {message.role === 'assistant' && (
                    <BotIcon className="size-4 stroke-current" />
                  )}
                </div>
              </div>

              <div>
                {message.status === 'pending' && (
                  <Spinner className="size-3 text-muted" />
                )}

                {message.status === 'error' && (
                  <div className="text-destructive">
                    There was a problem sending your question. Please try again!
                  </div>
                )}

                {message.text && (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a(props) {
                        if (props.href?.startsWith('/')) {
                          return (
                            <Link href={`/blob${props.href}`}>
                              {props.children}
                            </Link>
                          );
                        }

                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                        />;
                      },
                    }}
                    className="markdown-body">
                    {message.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {props.onSubmit && (
        <footer className={cn('border-t', props.footerClassName)}>
          <form
            onSubmit={e => {
              e.preventDefault();
              props.onSubmit?.(value);
              setValue('');
            }}>
            <textarea
              onChange={e => setValue(e.target.value)}
              value={value}
              placeholder="Ask AI File Manager a question..."
              className="bg-transparent resize-none p-2 flex w-full text-sm outline-none placeholder"
              onKeyDown={e => {
                switch (e.key) {
                  case 'Enter':
                    if (value) {
                      e.preventDefault();
                      props.onSubmit?.(value);
                      setValue('');
                    }
                    break;
                  default:
                    break;
                }
              }}
            />
          </form>
        </footer>
      )}
    </div>
  );
}
