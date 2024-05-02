'use client';

import {useState, useEffect} from 'react';
import type ReactPdf from 'react-pdf';

import type {RendererProps} from '@elwood/common';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {useGetNodePublicUrl} from '@/data/node/use-get-node-public-url';

export type RenderPdfProps = RendererProps<{}>;

export default function RenderPdf(props: RenderPdfProps): JSX.Element {
  const [reactPdf, setReactPdf] = useState<typeof ReactPdf | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  const {data, isLoading} = useGetNodePublicUrl({
    path: props.path.split('/'),
  });

  useEffect(() => {
    import('react-pdf').then((module: typeof ReactPdf) => {
      const {pdfjs} = module;
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      setReactPdf(module);
    });
  }, []);

  function onDocumentLoadSuccess(e: {numPages: number}) {
    setNumPages(e.numPages);
    props.onReady();
  }

  if (!reactPdf || isLoading) {
    return <div />;
  }

  return (
    <reactPdf.Document
      renderMode="canvas"
      className="bg-white text-black w-full h-full"
      file={data?.signedUrl || ''}
      onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(new Array(numPages), (el, index) => (
        <reactPdf.Page
          className="w-full"
          width={props.width}
          height={props.height}
          key={`page_${index + 1}`}
          pageNumber={index + 1}
        />
      ))}
    </reactPdf.Document>
  );
}
