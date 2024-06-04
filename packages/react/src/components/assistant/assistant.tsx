import {useState} from 'react';
import {BotIcon, Button, cn, Spinner} from '@elwood/ui';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type AssistantMessage = {
  id: string | number;
  text: string;
  role: 'user' | 'them' | 'assistant';
  from?: string;
  avatarUrl?: string;
  status: 'pending' | 'processing' | 'sent';
};

export type AssistantProps = {
  messages: AssistantMessage[];
  className?: string;
  footerClassName?: string;
  onSubmit(term: string): void;
};

export function Assistant(props: AssistantProps) {
  const [value, setValue] = useState('');

  return (
    <div className={cn(props.className, 'size-full flex flex-col')}>
      <div className="flex-grow overflow-auto space-y-3">
        {props.messages.map(message => {
          return (
            <div
              key={`assistant-${message.id}`}
              className={cn(
                'flex',
                message.role === 'user' && 'text-muted-foreground',
              )}>
              {message.role === 'assistant' && (
                <div className="mr-3 w-6">
                  <div className="size-6 flex items-center justify-center text-muted-foreground">
                    <BotIcon className="size-6 stroke-current" />
                  </div>
                </div>
              )}
              <div>
                <header className="font-semibold">
                  {message.role === 'user' && 'You'}
                  {message.role === 'them' && message.from}
                  {message.role === 'assistant' && 'File Manager'}
                </header>
                {message.status === 'pending' && (
                  <Spinner className="size-3 text-muted" />
                )}

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{}}
                  className="prose dark:prose-dark">
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>

      <footer className={cn('', props.footerClassName)}>
        <form
          onSubmit={e => {
            e.preventDefault();
            props.onSubmit(value);
            setValue('');
          }}>
          <textarea
            onChange={e => setValue(e.target.value)}
            value={value}
            placeholder="Ask File Manager AI a question..."
            className="bg-transparent resize-none p-2 flex w-full border rounded text-sm outline-none placeholder:border"
            onKeyDown={e => {
              switch (e.key) {
                case 'Enter':
                  if (value) {
                    e.preventDefault();
                    props.onSubmit(value);
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
    </div>
  );
}
