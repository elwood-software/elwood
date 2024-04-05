import {Textarea, Button} from '@elwood/ui';
import {invariant, toArray} from '@elwood/common';
import {
  type ChangeEvent,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import {Chat, type ChatFeedItem} from '@/components/activity/chat';
import {ChatFooter} from '@/components/activity/chat-footer';
import {useActivity} from '@/data/activity/use-activity';
import {useCreateActivity} from '@/data/activity/use-create-activity';

export interface UseChatInput {
  assetId: string | null | undefined;
  assetType: string;
}

export function useChat(input: UseChatInput): JSX.Element {
  const [value, setValue] = useState('');
  const action = useCreateActivity();
  const query = useActivity(
    {
      assetId: input.assetId ?? '',
      assetType: input.assetType,
    },
    {
      enabled: Boolean(input.assetId),
    },
  );

  const feed = toArray(query.data).map(item => {
    return {
      id: item.id,
      type: 'message',
      content: item.text,
      timestamp: new Date(item.created_at ?? ''),
      author: 'poop',
      children: [],
      likes: 0,
    };
  });

  function onSubmit(e: FormEvent): void {
    e.preventDefault();

    invariant(input.assetId, 'Must provide an assetId');
    invariant(value, 'Must provide a value');

    action
      .mutateAsync({
        assetId: input.assetId,
        assetType: input.assetType,
        text: value.trim(),
        type: 'COMMENT',
      })
      .then(() => {
        //
      })
      .catch(() => {
        //
      })
      .finally(() => {
        setValue('');
      });
  }

  function onChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    setValue(e.target.value);
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (
      e.key === 'Enter' &&
      !e.altKey &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      onSubmit(e);
    }
  }

  const footer = (
    <ChatFooter
      onSubmit={onSubmit}
      textarea={
        <Textarea
          placeholder="Add a comment"
          ring={false}
          onChange={onChange}
          value={value}
          className="ring-none outline-none focus-visible:ring-0 resize-none p-0 pl-0.5"
          onKeyDown={onKeyDown}
        />
      }
    />
  );

  return <Chat feed={feed} footer={footer} />;
}
