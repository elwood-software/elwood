'use client';

import {use, useRef} from 'react';

import {AnimatedBeam} from '@/components/animated-beam';

export default function Flow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const setupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const convertRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      ref: triggerRef,
      text: 'Watch',
      name: 'when',
      desc: 'Any time a file is added to the storage bucket, Elwood Run can execute a workflow',
    },
    {
      ref: setupRef,
      text: 'Setup the Worker',
      name: 'setup',
      desc: 'Easily install any software your need. Here we install ffmpeg to convert the MP4',
    },

    {
      ref: downloadRef,
      text: 'Gather the Files',
      name: 'download',
      desc: 'Pull in any sized file from the internet or your storage bucket',
    },
    {
      ref: convertRef,
      name: 'convert',
      text: 'Transform',
      desc: 'Run any command line tool or script to process the file. Here we convert the MP4 to MP3',
    },
    {
      ref: uploadRef,
      text: 'Save Your Work',
      name: 'upload',
      desc: 'Put your files back in your storage bucket with a simple copy command',
    },
  ];

  return (
    <div ref={containerRef} className="relative flex flex-col">
      {steps.map(step => (
        <div className="flex" key={step.text}>
          <div className="w-3 mr-6">
            <div
              className="size-3 bg-muted-foreground rounded-full mt-2 z-10"
              ref={step.ref}></div>
          </div>
          <div className="mb-6">
            <h2 className="font-medium mb-1">
              {step.text}{' '}
              <small className="text-muted-foreground/40 ml-1">
                {step.name}
              </small>
            </h2>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </div>
        </div>
      ))}

      <span className="text-muted-foreground">
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={triggerRef}
          toRef={setupRef}
          pathColor="currentColor"
          pathOpacity={1}
        />

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={setupRef}
          toRef={downloadRef}
          pathColor="currentColor"
          pathOpacity={1}
        />

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={downloadRef}
          toRef={convertRef}
          pathColor="currentColor"
          pathOpacity={1}
        />

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={convertRef}
          toRef={uploadRef}
          pathColor="currentColor"
          pathOpacity={1}
        />
      </span>
    </div>
  );
}
