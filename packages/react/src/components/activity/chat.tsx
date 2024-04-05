import {type ReactNode} from 'react';
import {Textarea} from '@elwood/ui';

export interface ChatFeedItem {
  id: string;
  type: 'message' | 'system' | 'reaction';
  content: ReactNode;
  timestamp: number;
  author: string;
  children: ChatFeedItem[];
  likes: number;
}

export interface ChatProps {
  feed: ChatFeedItem[];
  footer: ReactNode;
}

export function Chat(props: ChatProps): JSX.Element {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {props.feed.map(item => {
          return <div key={`ChatItem-${item.id}`}>{item.content}</div>;
        })}
      </div>
      <div className="p-3">{props.footer}</div>
    </div>
  );
}
