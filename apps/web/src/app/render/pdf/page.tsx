'use client';

import {useState, useEffect} from 'react';
import {pdfjs, Document, Page} from 'react-pdf';
import {useMeasure} from 'react-use';

import {JsonObject} from '@elwood/common';
import {Spinner} from '@elwood/ui';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function RenderPdfPage(): JSX.Element {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [ref, {width, height}] = useMeasure<HTMLDivElement>();
  const [isReady, setIsReady] = useState(false);

  function postMessage(type: string, value: JsonObject) {
    window.parent.postMessage({type, value}, location.origin);
  }

  useEffect(() => {
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    }
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

  return (
    <div ref={ref}>
      {!isReady && (
        <div className="min-h-10 w-full h-full flex justify-center absolute top-0 left-0 z-50 bg-background">
          <Spinner className="mt-5 stroke-muted-foreground" />
        </div>
      )}

      <Document
        renderMode="canvas"
        className="bg-white text-black w-full h-full"
        file="http://127.0.0.1:54321/storage/v1/object/sign/Company%20Assets/script.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDb21wYW55IEFzc2V0cy9zY3JpcHQucGRmIiwiaWF0IjoxNzE0MzIzODk2LCJleHAiOjE3MTQ0MTAyOTZ9._HIfN3zBk-7wGV1THG39tt5RM-PaOZil18zJF5qaPBo"
        onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            className="w-full"
            width={width}
            height={height}
            key={`page_${index + 1}`}
            pageNumber={index + 1}
          />
        ))}
      </Document>
    </div>
  );
}
