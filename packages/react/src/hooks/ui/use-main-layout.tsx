import {
  type PropsWithChildren,
  useState,
  useMemo,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useReducer,
  Reducer,
  useCallback,
} from 'react';
import {useDebounce} from 'react-use';
import {FolderIcon, FileIcon, useTheme} from '@elwood/ui';
import {Json} from '@elwood/common';

import {type MainLayoutProps} from '@/components/layouts/main';
import {Link} from '@/components/link';
import {type HeaderProps} from '@/components/header/header';
import {HeaderSearch, HeaderSearchProps} from '@/components/header/search';

import {HeaderUserMenu} from '@/components/header/user-menu';
import {useProviderContext} from '@/hooks/use-provider-context';
import {useSearch} from '@/data/search/use-search';
import {useCurrentMember} from '../use-current-member';
import {useAssistant} from './use-assistant';

type MainLayoutContextValue = {
  setTitle(title: ReactNode): void;
};

export type MainLayoutState = {
  contextValue: MainLayoutContextValue;
  title: ReactNode;
  workspaceName: ReactNode;
  search: ReactNode;
  assistant: ReactNode;
  userMenu: ReactNode;
};

const MainLayoutContext = createContext<MainLayoutContextValue>({
  setTitle: () => {},
});

export const MainLayoutProvider = MainLayoutContext.Provider;

export type UseMainLayoutInput = PropsWithChildren<
  MainLayoutProps & {
    showBucketsSidebar?: boolean;
    title?: HeaderProps['title'];
  }
>;

export function useMainLayout(
  input: PropsWithChildren<UseMainLayoutInput> = {},
): MainLayoutState {
  const {workspaceName, avatarUrl, onLogout, featureFlags} =
    useProviderContext();
  const currentMember = useCurrentMember();
  const theme = useTheme();

  const [contextValue, dispatch] = useReducer<
    Reducer<
      {
        title: MainLayoutState['title'];
      },
      {type: 'SET_TITLE'; value: MainLayoutState['title']}
    >
  >(
    (state, action) => {
      switch (action.type) {
        case 'SET_TITLE':
          if (state.title === action.value) {
            return state;
          }

          return {
            ...state,
            title: action.value,
          };
      }
    },
    {
      title: null,
    },
  );

  // Search
  const [searchValue, setSearchValue] = useState('');
  const [searchDebounceValue, setSearchDebounceValue] = useState('');
  const [_, cancelSearchDebounce] = useDebounce(
    () => {
      setSearchDebounceValue(searchValue);
    },
    500,
    [searchValue],
  );
  const searchQuery = useSearch({value: searchDebounceValue});
  const searchLoading =
    searchQuery.isFetching ||
    searchQuery.isLoading ||
    searchValue !== searchDebounceValue;
  const searchResults = mapSearchResults(searchQuery.data ?? []);

  const search = useMemo(() => {
    if (featureFlags.enable_search === false) {
      // make sure to return a real node so the
      // grid layout doesn't break
      return <div></div>;
    }

    return (
      <HeaderSearch
        loading={searchLoading}
        value={searchValue}
        onChange={value => {
          setSearchValue(value);
        }}
        results={searchResults}
      />
    );
  }, [searchValue, searchLoading, searchResults, featureFlags.enable_search]);

  // User Menu
  const userMenu = useMemo(
    () => (
      <HeaderUserMenu
        avatarUrl={avatarUrl}
        name={currentMember.display_name ?? ''}
        userName={currentMember.username ?? ''}
        items={[]}
        theme={theme.value}
        onLogoutClick={e => {
          e.preventDefault();
          onLogout();
        }}
        onThemeChange={value => theme.change(value as typeof theme.value)}
      />
    ),
    [theme.value],
  );

  const assistant = useAssistant({
    footerClassName: '',
  });

  useEffect(() => {
    return function unload() {
      cancelSearchDebounce();
    };
  }, []);

  return {
    contextValue: {
      setTitle(nextTitle) {
        dispatch({
          type: 'SET_TITLE',
          value: nextTitle,
        });
      },
    },
    title: contextValue.title,
    workspaceName,
    search,
    assistant,
    userMenu,
  };
}

export function useSetMainLayoutTitle(
  title: MainLayoutState['title'],
  deps: Json[] = [],
) {
  const ctx = useContext(MainLayoutContext);

  useEffect(() => {
    ctx.setTitle(title);
  }, deps);
}

function mapSearchResults(
  results: Array<{name: string; bucket_id: string}>,
): HeaderSearchProps['results'] {
  const groups = [...new Set(results.map(r => r.bucket_id))];

  return groups.map(group => {
    const items = results
      .filter(item => item.bucket_id === group)
      .map(item => {
        const name = item.name.trim().replace('.emptyFolderPlaceholder', '');
        const nameParts = name.split('/').filter(item => item.length > 0);
        const isFolder = item.name.endsWith('.emptyFolderPlaceholder');

        return {
          id: item.name,
          icon: isFolder ? FolderIcon : FileIcon,
          title: (
            <Link href={`/${isFolder ? 'tree' : 'blob'}/${group}/${name}`}>
              {nameParts.map((part, l) => {
                if (l === nameParts.length - 1) {
                  return <span key={`${item.name}-${l}`}>{part}</span>;
                }

                return (
                  <span
                    className="text-muted-foreground"
                    key={`${item.name}-${l}`}>
                    {part} /{' '}
                  </span>
                );
              })}
            </Link>
          ),
        };
      });

    items.sort(a => (a.id.endsWith('.emptyFolderPlaceholder') ? -1 : 1));

    return {
      title: group,
      items,
    };
  });
}
