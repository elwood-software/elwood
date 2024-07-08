import {useCallback, useEffect, useState} from 'react';
import type {PropsWithChildren, ReactNode} from 'react';
import sha256 from 'crypto-js/sha256';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import {invariant, type MemberRecord} from '@elwood/common';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {ProviderContext, type ProviderContextValue} from '@/context';
import {NoAccess} from '@/components/no-access';
import {defaultRenders} from '@/renderer/default-renderers';
import {MainLayout} from '@/components/layouts/main';
import {Header} from './components/header/header';

import {FeatureFlag, ConfigurationNames} from './constants';

export type ElwoodProviderProps = Omit<
  ProviderContextValue,
  'uploadManager' | 'member' | 'avatarUrl' | 'configuration' | 'featureFlags'
> & {
  featureFlags?: Partial<Record<FeatureFlag, boolean>> | undefined;
  loadingComponent?: ReactNode | undefined;
};

const queryClient = new QueryClient();

TimeAgo.addDefaultLocale(en);

export function ElwoodProvider(
  props: PropsWithChildren<ElwoodProviderProps>,
): JSX.Element {
  invariant(props.client, 'Client is required for ElwoodProvider');

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [member, setMember] = useState<MemberRecord | null | false>(null);
  const [uploadManager, setUploadManager] = useState<Uppy | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const getHeaders = useCallback(() => {
    return {
      authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      apikey: props.client.key,
    };
  }, [accessToken, props.client.key]);
  const renderers = props.renderers ?? defaultRenders;

  // make sure feature flags are defined
  const featureFlags: ProviderContextValue['featureFlags'] = {
    [FeatureFlag.EnableAssistant]:
      props.featureFlags?.[FeatureFlag.EnableAssistant] ?? false,
    [FeatureFlag.EnableBookmarks]:
      props.featureFlags?.[FeatureFlag.EnableBookmarks] ?? false,
    [FeatureFlag.EnableSearch]:
      props.featureFlags?.[FeatureFlag.EnableSearch] ?? false,
  };

  const configuration: ProviderContextValue['configuration'] = {
    [ConfigurationNames.FunctionName]: 'elwood',
    [ConfigurationNames.AiFunctionName]: 'elwood-ai',
  };

  useEffect(() => {
    setUploadManager(
      new Uppy().use(Tus, {
        endpoint: `${props.client.url}/storage/v1/upload/resumable`,
        uploadDataDuringCreation: true,
        chunkSize: 6 * 1024 * 1024,
        allowedMetaFields: [
          'bucketName',
          'objectName',
          'contentType',
          'cacheControl',
        ],

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- intentional @travis
        // @ts-expect-error
        // TRAVIS the documentation and code say that
        // 'headers' can be a function or object, but the
        // types say that it can only be an object, so we're going
        // ot wait to see if they ever fix
        headers: getHeaders,
      }),
    );

    props.client.auth
      .getSession()
      .then(async ({data}) => {
        invariant(data.session?.access_token);

        const user = await props.client.auth.getUser();
        const token = sha256(user.data.user?.email ?? Math.random().toString());

        setAvatarUrl(`https://gravatar.com/avatar/${token}?d=identicon`);

        const result = await props.client
          .members()
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();

        invariant(result.data, 'Member is missing');

        setMember(result.data);
        setAccessToken(data.session.access_token);
      })
      .catch(() => {
        setMember(false);
      });
  }, [props.client, getHeaders]);

  if (member === false) {
    return <NoAccess />;
  }

  if (member === null) {
    return props.loadingComponent ? (
      <>{props.loadingComponent}</>
    ) : (
      <MainLayout
        header={<Header workspaceName={props.workspaceName} />}
        loading={true}
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ProviderContext.Provider
        value={{
          ...props,
          featureFlags,
          configuration,
          uploadManager,
          member,
          renderers,
          avatarUrl,
        }}>
        {props.children}
      </ProviderContext.Provider>
    </QueryClientProvider>
  );
}
