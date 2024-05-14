import React from 'react';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import Markdoc from '@markdoc/markdoc';

import {DocsLayout} from '@/components/DocsLayout';

type PageProps = {
  params: {
    html: string;
  };
};

export default async function Page(props: PageProps) {
  const changelogDoc = readFileSync(
    join(__dirname, '../../../../../../..', 'CHANGELOG.md'),
    'utf-8',
  );

  const ast = Markdoc.parse(changelogDoc);
  const content = Markdoc.transform(ast);

  return (
    <DocsLayout frontmatter={{}} nodes={[]}>
      <div
        dangerouslySetInnerHTML={{
          __html: Markdoc.renderers.html(content),
        }}
      />
    </DocsLayout>
  );
}
