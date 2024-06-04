import {useState, type ReactNode} from 'react';
import {BookMarkedIcon, StarIcon, CircleHelpIcon, XIcon} from '@elwood/ui';
import {Button} from '@/components/button';

export interface SidebarFooterProps {
  userMenu: ReactNode;
  uploadStatus: ReactNode;
}

export function SidebarFooter(props: SidebarFooterProps): JSX.Element {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <footer>
      <div className="mb-3 mx-6">{props.uploadStatus}</div>

      <div className="border-t px-6 pb-1 mt-6 flex items-center justify-center space-x-1">
        <Button
          variant="link"
          size="xs"
          href="https://github.com/elwood-software/elwood"
          className="text-muted-foreground"
          icon={<StarIcon className="size-[1em]" />}
          target="_blank">
          Star on Github
        </Button>

        <Button
          onClick={e => {
            e.preventDefault();
            setFeedbackOpen(true);
          }}
          variant="link"
          size="xs"
          href="https://elwood.company/feedback"
          className="text-muted-foreground"
          target="_blank">
          Send Feedback
        </Button>

        {feedbackOpen ? (
          <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-50">
            <iframe
              src="https://elwood.company/feedback/embed"
              className="w-full h-full border-none"
            />
            <button
              onClick={() => setFeedbackOpen(false)}
              className="fixed top-6 right-6 z-50">
              <XIcon />
            </button>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
