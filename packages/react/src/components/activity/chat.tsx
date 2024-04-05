import {type ReactNode} from 'react';
import {Avatar} from '@elwood/ui';
import ReactTimeAgo from 'react-time-ago';

export interface ChatFeedItem {
  id: string;
  type: 'message' | 'system' | 'reaction';
  content: ReactNode;
  author: string;
  timestamp: Date;
  children: ReactNode[];
}

export interface ChatProps {
  feed: ChatFeedItem[];
  footer: ReactNode;
}

export function Chat(props: ChatProps): JSX.Element {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto divide-y">
        {props.feed.map(item => {
          return (
            <div key={`ChatItem-${item.id}`} className="p-3 flex">
              <div className="mr-3">
                <Avatar fallback={item.author} round />
              </div>
              <div>
                <header className="text-sm text-muted-foreground mb-1">
                  <strong>{item.author}</strong>

                  <ReactTimeAgo
                    date={item.timestamp}
                    timeStyle="twitter"
                    className="text-xs ml-2"
                  />
                </header>
                {item.content}
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3">{props.footer}</div>
    </div>
  );
}
