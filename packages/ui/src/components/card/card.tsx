import {type ReactNode, type PropsWithChildren} from 'react';
import {cn} from '../../lib/utils';
import {CardBase} from './card-base';

export interface CardProps {
  title?: ReactNode | ((wrapper: typeof CardBase.Title) => ReactNode);
  description?:
    | ReactNode
    | ((wrapper: typeof CardBase.Description) => ReactNode);
  contentClassName?: string;
  className?: string;
}

export function Card(props: PropsWithChildren<CardProps>): JSX.Element {
  const showHeader = props.title ?? props.description;
  const title =
    typeof props.title === 'function'
      ? props.title(CardBase.Title)
      : props.title && <CardBase.Title>{props.title}</CardBase.Title>;
  const description =
    typeof props.description === 'function'
      ? props.description(CardBase.Description)
      : props.description && (
          <CardBase.Description>{props.description}</CardBase.Description>
        );

  const contentClassName = cn({'pt-6': !showHeader}, props.contentClassName);

  return (
    <CardBase.Root className={props.className}>
      {showHeader ? (
        <CardBase.Header>
          {title}
          {description}
        </CardBase.Header>
      ) : null}
      <CardBase.Content className={contentClassName}>
        {props.children}
      </CardBase.Content>
    </CardBase.Root>
  );
}
