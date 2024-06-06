import {extname} from 'node:path';
import {type EmbeddingSource} from './base.ts';
import {MarkdownEmbeddingSource} from './markdown.ts';
import {assert} from '../../_shared/deps.ts';

export function embeddingSourceByExtension(
  fileName: string,
  content: string,
): EmbeddingSource | undefined {
  assert(fileName, 'Missing fileName');
  assert(content, 'Missing content');

  const ext = extname(fileName).toLocaleLowerCase();

  switch (ext) {
    case '.mdx':
      return new MarkdownEmbeddingSource(content, true);
    case '.md':
      return new MarkdownEmbeddingSource(content);
    default:
      return undefined;
  }
}
