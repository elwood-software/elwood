import {useEffect, useReducer, type Dispatch} from 'react';
import type {SupabaseClient, RealtimeChannel} from '@elwood/js';
import {invariant} from '@elwood/common';
import {useSupabase} from './use-client';

function noOp() {
  // do nothing
}

interface PresenceUser {
  id: string;
  isMe: boolean;
  joinedAt: Date;
  x: number;
  y: number;
}

interface PresenceState {
  room: RealtimeChannel | null;
  status: 'idle' | 'ready' | 'error';
  error: Error | undefined;
  users: PresenceUser[];
}

type PresenceAction =
  | {
      type: 'set-room';
      data: {
        room: RealtimeChannel;
      };
    }
  | {
      type: 'set-status';
      data: {
        value: PresenceState['status'];
        error?: Error;
      };
    }
  | {
      type: 'join';
      data: {
        users: string[];
      };
    }
  | {
      type: 'leave';
      data: {
        users: string[];
      };
    };

const initialState: PresenceState = {
  room: null,
  status: 'idle',
  error: undefined,
  users: [],
};

export function usePresence(key: string | undefined): PresenceState {
  const supabase = useSupabase();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // don't do anything without a key
    if (!key) {
      return;
    }

    const to = setTimeout(() => {
      subscribe({supabase, key, dispatch})
        .then(() => {
          dispatch({
            type: 'set-status',
            data: {
              value: 'ready',
            },
          });
        })
        .catch(err => {
          dispatch({
            type: 'set-status',
            data: {
              value: 'error',
              error: err as Error,
            },
          });
        });
    }, 1000);

    return function unload() {
      clearTimeout(to);
    };
  }, [key, supabase]);

  useEffect(() => {
    return function unload() {
      state.room && supabase.removeChannel(state.room).catch(() => {});
    };
  }, [state.room, supabase]);

  return state;
}

function reducer(state: PresenceState, action: PresenceAction): PresenceState {
  switch (action.type) {
    case 'set-room': {
      return {
        ...state,
        room: action.data.room,
      };
    }
    case 'set-status': {
      return {
        ...state,
        status: action.data.value,
        error: action.data.error,
      };
    }
    case 'join': {
      return {
        ...state,
        users: state.users.concat(
          action.data.users.map(id => ({
            id,
            isMe: false,
            joinedAt: new Date(),
            x: 0,
            y: 0,
          })),
        ),
      };
    }
    case 'leave': {
      return {
        ...state,
        users: state.users.filter(u => !action.data.users.includes(u.id)),
      };
    }
    default: {
      return state;
    }
  }
}

interface SubscribeOptions {
  supabase: SupabaseClient;
  key: string;
  dispatch: Dispatch<PresenceAction>;
}

async function subscribe(opts: SubscribeOptions): Promise<void> {
  const {supabase, key, dispatch} = opts;
  const {
    data: {user},
  } = await supabase.auth.getUser();

  invariant(user, 'must have user to subscribe');

  const room = supabase.channel(key);

  dispatch({
    type: 'set-room',
    data: {
      room,
    },
  });

  room
    .on('broadcast', {event: 'cursor'}, e => {
      console.log('cursor');
    })
    .on('presence', {event: 'sync'}, () => {
      console.log('sync');
    })
    .on('presence', {event: 'join'}, e => {
      dispatch({
        type: 'join',
        data: {
          users: e.newPresences.map(p => p.user_id),
        },
      });
    })
    .on('presence', {event: 'leave'}, e => {
      dispatch({
        type: 'leave',
        data: {
          users: e.leftPresences.map(p => p.user_id),
        },
      });
    })
    .subscribe(() => {
      console.log('joined');

      room
        .track({
          user_id: user.id,
        })
        .then(noOp)
        .catch(noOp);
    });
}
