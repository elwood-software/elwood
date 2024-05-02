'use client';

import {useState, useEffect, lazy} from 'react';
import type ReactPdf from 'react-pdf';
import {useMeasure} from 'react-use';

import {JsonObject} from '@elwood/common';
import {Spinner} from '@elwood/ui';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function RenderPdf(): JSX.Element {
  const [reactPdf, setReactPdf] = useState<typeof ReactPdf | null>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [ref, {width, height}] = useMeasure<HTMLDivElement>();
  const [isReady, setIsReady] = useState(false);

  function postMessage(type: string, value: JsonObject) {
    window.parent.postMessage({type, value}, location.origin);
  }

  useEffect(() => {
    import('react-pdf').then(module => {
      setReactPdf(module);
      const {pdfjs} = module;

      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      }
    });
  }, []);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data === 'init') {
        postMessage('height', {height});
        return;
      }
    }

    window.addEventListener('message', onMessage);

    return function unload() {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  useEffect(() => {
    if (parent) {
      postMessage('height', {height});
    }
  }, [height]);

  function onDocumentLoadSuccess(e: {numPages: number}) {
    setNumPages(e.numPages);
    postMessage('success', {
      height,
      numPages: e.numPages,
    });
    setIsReady(true);
  }

  if (!reactPdf) {
    return (
      <div className="min-h-10 w-full h-full flex justify-center absolute top-0 left-0 z-50 bg-background">
        <Spinner className="mt-5 stroke-muted-foreground" />
      </div>
    );
  }

  return (
    <div ref={ref}>
      {!isReady && (
        <div className="min-h-10 w-full h-full flex justify-center absolute top-0 left-0 z-50 bg-background">
          <Spinner className="mt-5 stroke-muted-foreground" />
        </div>
      )}

      <reactPdf.Document
        renderMode="canvas"
        className="bg-white text-black w-full h-full"
        file={''}
        onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <reactPdf.Page
            className="w-full"
            width={width}
            height={height}
            key={`page_${index + 1}`}
            pageNumber={index + 1}
          />
        ))}
      </reactPdf.Document>
    </div>
  );
}
