import {useState, type PropsWithChildren, useMemo} from 'react';

import {useProviderContext} from '@/hooks/use-provider-context';
import {MainLayout, type MainLayoutProps} from '@/components/layouts/main';

import {Link} from '@/components/link';
import {Header, HeaderProps} from '@/components/header/header';

import {HeaderUserMenu} from '@/components/header/user-menu';

import {useSidebarFooter} from './use-sidebar-footer';
import {HeaderSearch} from '@/components/header/search';
import {useCurrentMember} from '../use-current-member';
import {useTheme} from '@elwood/ui';

export type UseMainLayoutInput = PropsWithChildren<
  MainLayoutProps & {
    showBucketsSidebar?: boolean;
    title?: HeaderProps['title'];
  }
>;

export function useMainLayout(
  input: PropsWithChildren<UseMainLayoutInput> = {},
): JSX.Element {
  const [searchValue, setSearchValue] = useState('');

  const {workspaceName, onLogout} = useProviderContext();
  const currentMember = useCurrentMember();
  const sidebarFooter = useSidebarFooter();
  const theme = useTheme();

  const userMenu = useMemo(
    () => (
      <HeaderUserMenu
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
  const search = useMemo(() => {
    return (
      <HeaderSearch
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        results={[]}
      />
    );
  }, [searchValue]);
  const actions = <>{userMenu}</>;

  return (
    <MainLayout
      header={
        <Header
          workspaceName={<Link href="/">{workspaceName}</Link>}
          title={input.title}
          search={search}
          actions={actions}
        />
      }
      sidebarFooter={sidebarFooter}
      sidebar={input.sidebar}>
      {input.children}
    </MainLayout>
  );
}
