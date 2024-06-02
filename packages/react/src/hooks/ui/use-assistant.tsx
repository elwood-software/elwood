import {useCallback, useRef, useReducer, useState} from 'react';
import {SSE} from 'sse.js';

import {Assistant, type AssistantProps} from '@/components/assistant/assistant';
import {useClient} from '../use-client';

enum MessageStatus {
  Pending = 'pending',
  Processing = 'processing',
  Sent = 'sent',
}

type Message = {
  role: 'user' | 'assistant';
  id: number;
  text: string;
  status: MessageStatus;
};

type Actions =
  | {
      type: 'new';
      message: Message;
    }
  | {
      type: 'update';
      append?: boolean;
      message: Pick<Message, 'id'> & Partial<Omit<Message, 'id'>>;
    }
  | {
      type: 'clear';
    };

function reducer(state: Message[], action: Actions): Message[] {
  console.log(action);

  switch (action.type) {
    case 'new': {
      return [...state, action.message];
    }

    case 'update': {
      if (action.append) {
        return state.map(message => {
          if (message.id === action.message.id) {
            return {
              ...message,
              text: message.text + action.message.text,
            };
          }

          return message;
        });
      }

      return state.map(message => {
        if (message.id === action.message.id) {
          return {
            ...message,
            ...action.message,
          };
        }

        return message;
      });
    }

    default: {
      return state;
    }
  }
}

export function useAssistant(
  props: Omit<AssistantProps, 'messages' | 'onSubmit'>,
): JSX.Element {
  const client = useClient();
  const eventSourceRef = useRef<SSE>();

  const [isSending, setIsSending] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(1);
  const [messages, dispatch] = useReducer(reducer, []);

  const onSubmit = useCallback(
    (term: string) => {
      if (isSending) {
        return;
      }

      dispatch({
        type: 'new',
        message: {
          id: currentMessageId - 1,
          status: MessageStatus.Sent,
          role: 'user',
          text: term,
        },
      });

      dispatch({
        type: 'new',
        message: {
          id: currentMessageId,
          role: 'assistant',
          text: '',
          status: MessageStatus.Pending,
        },
      });

      const eventSource = new SSE(
        `${client.url}/functions/v1/elwood/assistant`,
        {
          headers: {
            apikey: client.key,
            Authorization: `Bearer ${client.key}`,
            'Content-Type': 'application/json',
          },
          payload: JSON.stringify({
            messages: messages
              .filter(({status}) => status === MessageStatus.Sent)
              .map(({role, text}) => ({role, content: text}))
              .concat({role: 'user', content: term}),
          }),
        },
      );

      eventSource.addEventListener('message', (event: MessageEvent) => {
        if (event.data === '[DONE]') {
          setIsSending(false);
          dispatch({
            type: 'update',
            message: {
              id: currentMessageId,
              status: MessageStatus.Sent,
            },
          });
          setCurrentMessageId(x => x + 2);
          return;
        }

        dispatch({
          type: 'update',
          message: {
            id: currentMessageId,
            status: MessageStatus.Processing,
          },
        });

        setIsSending(true);

        const completionChunk = JSON.parse(event.data);
        const [
          {
            delta: {content},
          },
        ] = completionChunk.choices;

        if (content) {
          dispatch({
            type: 'update',
            append: true,
            message: {
              id: currentMessageId,
              text: content,
            },
          });
        }
      });

      eventSource.stream();
      eventSourceRef.current = eventSource;
    },
    [currentMessageId, messages],
  );

  return <Assistant onSubmit={onSubmit} messages={messages} {...props} />;
}
