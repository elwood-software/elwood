import {JsonObject} from '../../_shared/types.ts';

export type EmbeddingSourceChunk = {
  content: string;
  summary: string;
  id: string;
  metadata: JsonObject;
};

export abstract class EmbeddingSource {
  public chunks: EmbeddingSourceChunk[] = [];
  constructor(public readonly content: string = '') {}

  abstract generate(): Promise<void>;
}
