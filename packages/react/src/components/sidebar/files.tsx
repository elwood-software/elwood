import {Icons} from '@elwood/ui';
import {toArray} from '@elwood/common';
import type {NodeRecord} from '@elwood/common';
import {NodeLink} from '@/components/link';
import {FileIcon} from '../files/icon';

export interface FilesSidebarProps {
  children?: React.ReactNode;
}

export function FilesSidebar(props: FilesSidebarProps): JSX.Element {
  return <div className="pt-6">{props.children}</div>;
}
