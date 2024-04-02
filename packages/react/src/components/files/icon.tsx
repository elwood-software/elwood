import {Icons, type IconProps} from '@elwood/ui';
import type {NodeType} from '@elwood/common';

export interface FileIconProps extends IconProps {
  nodeType: NodeType;
}

export function FileIcon(props: FileIconProps): JSX.Element {
  const {nodeType, ...iconProps} = props;

  switch (nodeType) {
    case 'BUCKET':
      return <Icons.Bucket {...iconProps} />;
    case 'BLOB':
      return <Icons.File {...iconProps} />;
    case 'TREE':
      return <Icons.Folder fill="currentColor" {...iconProps} />;
    default:
      return <span />;
  }
}
