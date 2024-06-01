import {useState, type PropsWithChildren, useMemo, useEffect} from 'react';
import {useDebounce} from 'react-use';
import {
  FolderIcon,
  FileIcon,
  useTheme,
  Button,
  BookMarkedIcon,
  SparklesIcon,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@elwood/ui';

import {useProviderContext} from '@/hooks/use-provider-context';
import {MainLayout, type MainLayoutProps} from '@/components/layouts/main';

import {Link} from '@/components/link';
import {Header, HeaderProps} from '@/components/header/header';
import {HeaderSearch, HeaderSearchProps} from '@/components/header/search';
import {HeaderUserMenu} from '@/components/header/user-menu';

import {useSearch} from '@/data/search/use-search';
import {useSidebarFooter} from './use-sidebar-footer';
import {useCurrentMember} from '../use-current-member';

export type UseMainLayoutInput = PropsWithChildren<
  MainLayoutProps & {
    showBucketsSidebar?: boolean;
    title?: HeaderProps['title'];
  }
>;

export function useMainLayout(
  input: PropsWithChildren<UseMainLayoutInput> = {},
): JSX.Element {
  const {workspaceName, avatarUrl, onLogout} = useProviderContext();
  const currentMember = useCurrentMember();
  const sidebarFooter = useSidebarFooter();
  const theme = useTheme();

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
  }, [searchValue, searchLoading, searchResults]);

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

  useEffect(() => {
    return function unload() {
      cancelSearchDebounce();
    };
  }, []);

  return (
    <MainLayout
      header={
        <Header
          workspaceName={<Link href="/">{workspaceName}</Link>}
          title={input.title}
          search={search}
          actions={
            <>
              <Drawer direction="right" shouldScaleBackground={false}>
                <DrawerTrigger asChild={true}>
                  <Button type="button" size="sm" variant="outline-muted">
                    <SparklesIcon className="size-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>
                      This action cannot be undone.
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>ds</DrawerFooter>
                </DrawerContent>
              </Drawer>

              <Button href="/bookmarks" size="sm" variant="outline-muted">
                <BookMarkedIcon className="size-4" />
              </Button>
              {userMenu}
            </>
          }
        />
      }
      sidebarFooter={sidebarFooter}
      sidebar={input.sidebar}>
      {input.children}
    </MainLayout>
  );
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
