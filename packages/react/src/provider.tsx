import {useCallback, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import {invariant} from '@elwood/common';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {ProviderContext, type ProviderContextValue} from '@/context';

export type ElwoodProviderProps = Omit<ProviderContextValue, 'uploadManager'>;

const queryClient = new QueryClient();

TimeAgo.addDefaultLocale(en);

export function ElwoodProvider(
  props: PropsWithChildren<ElwoodProviderProps>,
): JSX.Element {
  invariant(props.client, 'Client is required for ElwoodProvider');

  const [uploadManager, setUploadManager] = useState<Uppy | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    return {
      authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      apikey: props.client.key,
    };
  }, [accessToken, props.client.key]);

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
      .then(({data}) => {
        invariant(data.session?.access_token);
        setAccessToken(data.session.access_token);
      })
      .catch(() => {
        throw new Error('Failed to initialize Uppy');
      });
  }, [props.client, getHeaders]);

  return (
    <QueryClientProvider client={queryClient}>
      <ProviderContext.Provider value={{...props, uploadManager}}>
        {props.children}
      </ProviderContext.Provider>
    </QueryClientProvider>
  );
}
