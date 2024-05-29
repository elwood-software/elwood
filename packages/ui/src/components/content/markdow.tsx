import {ComponentProps} from 'react';
import {cn} from '@ui/lib/utils';

export function ContentMarkdown(props: ComponentProps<'div'>) {
  const {className, ...divProps} = props;

  return <div {...divProps} className={cn(className, 'markdown-body')}></div>;
}
