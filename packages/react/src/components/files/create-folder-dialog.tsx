import {Dialog, type DialogProps, type DialogPropsFnArgs} from '@elwood/ui';
import {type GetNodeResult} from '@elwood/common';
import {
  CreateFolderForm,
  type CreateFolderFormProps,
} from './create-folder-form';
import {FileBreadcrumbs} from './breadcrumbs';

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
        <div className="mt-6">
          {createdFolders.map(item => {
            return (
              <div key={item.id}>
                <FileBreadcrumbs
                  onClick={close}
                  prefix={[...item.node.prefix, item.node.name]}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return <Dialog title="Create Folder" {...dialogProps} content={content} />;
}
