import type {Params} from 'react-router-dom';

export interface FilesRouteParams extends Params {
  bucket: string | undefined;
  type: string | undefined;
  '*': string | undefined;
}
