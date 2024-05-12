import {Dialog, type DialogProps, type DialogPropsFnArgs} from '@elwood/ui';
import {type GetNodeResult} from '@elwood/common';
import {
  CreateFolderForm,
  type CreateFolderFormProps,
} from './create-folder-form';
import {FileBreadcrumbs} from './breadcrumbs';
import {Button} from '../button';
import {createNodeLink} from '../link';

export type CreateFolderDialogProps = Omit<DialogProps, 'content'> &
  CreateFolderFormProps & {
    createdFolders: GetNodeResult[];
  };

export function CreateFolderDialog(
  props: CreateFolderDialogProps,
): JSX.Element {
  const {
    onSubmit,
    onChange,
    value,
    loading,
    createdFolders = [],
    ...dialogProps
  } = props;

  const content = ({close}: DialogPropsFnArgs): JSX.Element => (
    <>
      <CreateFolderForm
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={loading}
      />
      {createdFolders.length > 0 && (
        <div className="mt-6 space-y-3">
          {createdFolders.map(item => {
            return (
              <div
                key={`Create-Folder-${item.node.id}`}
                className="flex items-center justify-between">
                <FileBreadcrumbs
                  onClick={close}
                  prefix={[...item.node.prefix, item.node.name].map(String)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={close}
                  href={createNodeLink(item.node)}>
                  Open
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <Dialog
      title="Create Folder"
      {...dialogProps}
      content={content}
      className="max-w-[800px]"
    />
  );
}
