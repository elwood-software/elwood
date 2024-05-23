import {useCallback, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import {invariant, type MemberRecord} from '@elwood/common';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {Spinner} from '@elwood/ui';
import {ProviderContext, type ProviderContextValue} from '@/context';
import {NoAccess} from '@/components/no-access';
import {defaultRenders} from '@/renderer/default-renderers';
import {MainLayout} from '@/components/layouts/main';

export type ElwoodProviderProps = Omit<
  ProviderContextValue,
  'uploadManager' | 'member'
>;

const queryClient = new QueryClient();

TimeAgo.addDefaultLocale(en);

export function ElwoodProvider(
  props: PropsWithChildren<ElwoodProviderProps>,
): JSX.Element {
  invariant(props.client, 'Client is required for ElwoodProvider');

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
    return <MainLayout title={props.workspaceName} loading={true} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ProviderContext.Provider
        value={{...props, uploadManager, member, renderers}}>
        {props.children}
      </ProviderContext.Provider>
    </QueryClientProvider>
  );
}
