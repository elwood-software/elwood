import {crypto} from 'https://deno.land/std@0.224.0/crypto/mod.ts';
import {encodeHex} from 'https://deno.land/std@0.224.0/encoding/hex.ts';

import {fromMarkdown} from 'npm:mdast-util-from-markdown';
import {mdxjs} from 'npm:micromark-extension-mdxjs';
import {mdxFromMarkdown, MdxjsEsm} from 'npm:mdast-util-mdx';
import {Content, Root} from 'npm:mdast';
import {filter} from 'npm:unist-util-filter';
import {u} from 'npm:unist-builder';
import GithubSlugger from 'npm:github-slugger';
import {toMarkdown} from 'npm:mdast-util-to-markdown';
import {toString} from 'npm:mdast-util-to-string';

import {EmbeddingSource} from './base.ts';

export class MarkdownEmbeddingSource extends EmbeddingSource {
  constructor(
    public readonly content: string = '',
    private readonly isMdx = false,
  ) {
    super(content);
  }

  async generate() {
    const tree = this.isMdx
      ? fromMarkdown(this.content, {
          extensions: [mdxjs()],
          mdastExtensions: [mdxFromMarkdown()],
        })
      : fromMarkdown(this.content);

    const meta = this.extractMetaExport(tree);

    // Remove all MDX elements from markdown
    const markdownTree = filter(
      tree,
      node =>
        ![
          'mdxjsEsm',
          'mdxJsxFlowElement',
          'mdxJsxTextElement',
          'mdxFlowExpression',
          'mdxTextExpression',
        ].includes(node.type),
    );

    const sections = this.splitTreeBy(
      markdownTree,
      (node: Root) => node.type === 'heading',
    );

    const slugger = new GithubSlugger();

    for (const tree of sections) {
      const [firstNode] = tree.children;

      const heading = firstNode.type === 'heading' ? toString(firstNode) : '';
      const slug = heading ? slugger.slug(heading) : '';
      const content = toMarkdown(tree);
      const chunk_id = encodeHex(
        await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(content),
        ),
      );

      this.chunks.push({
        content,
        summary: heading,
        metadata: {...(meta ?? {}), headingSlug: slug},
        id: chunk_id,
      });
    }
  }

  extractMetaExport(mdxTree: Root) {
    const metaExportNode: MdxjsEsm = mdxTree.children.find((node: MdxjsEsm) => {
      return (
        node.type === 'mdxjsEsm' &&
        node.data?.estree?.body[0]?.type === 'ExportNamedDeclaration' &&
        node.data.estree.body[0].declaration?.type === 'VariableDeclaration' &&
        node.data.estree.body[0].declaration.declarations[0]?.id.type ===
          'Identifier' &&
        node.data.estree.body[0].declaration.declarations[0].id.name === 'meta'
      );
    });

    if (!metaExportNode) {
      return undefined;
    }

    const objectExpression =
      (metaExportNode.data?.estree?.body[0]?.type ===
        'ExportNamedDeclaration' &&
        metaExportNode.data.estree.body[0].declaration?.type ===
          'VariableDeclaration' &&
        metaExportNode.data.estree.body[0].declaration.declarations[0]?.id
          .type === 'Identifier' &&
        metaExportNode.data.estree.body[0].declaration.declarations[0].id
          .name === 'meta' &&
        metaExportNode.data.estree.body[0].declaration.declarations[0].init
          ?.type === 'ObjectExpression' &&
        metaExportNode.data.estree.body[0].declaration.declarations[0].init) ||
      undefined;

    if (!objectExpression) {
      return undefined;
    }

    return objectExpression.properties.reduce<
      Record<string, string | number | bigint | true | RegExp | undefined>
    >((object, property) => {
      if (property.type !== 'Property') {
        return object;
      }

      const key =
        (property.key.type === 'Identifier' && property.key.name) || undefined;
      const value =
        (property.value.type === 'Literal' && property.value.value) ||
        undefined;

      if (!key) {
        return object;
      }

      return {
        ...object,
        [key]: value,
      };
    }, {});
  }

  splitTreeBy(tree: Root, predicate: (node: Content) => boolean) {
    return tree.children.reduce<Root[]>((trees: Root[], node: MdxjsEsm) => {
      const [lastTree] = trees.slice(-1);

      if (!lastTree || predicate(node)) {
        const tree: Root = u('root', [node]);
        return trees.concat(tree);
      }

      lastTree.children.push(node);
      return trees;
    }, []);
  }
}
