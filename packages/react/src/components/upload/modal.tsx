import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  FileIcon,
} from '@elwood/ui';
import {FileBreadcrumbs} from '@/components/files/breadcrumbs';
import {Link, createNodeLink} from '@/components/link';

export interface UploadModalProps {
  files: {
    prefix: string[];
    name: string;
    size: number;
    type: string;
    error?: string;
  }[];
}

export function UploadModal(props: UploadModalProps): JSX.Element {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> </TableHead>
            <TableHead>File</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.files.map(file => {
            const fallback = (
              <div className="font-mono text-muted-foreground">
                {file.size} Bytes &middot; {file.type}
              </div>
            );
            const error = <div className="text-red-300">{file.error}</div>;
            const href = createNodeLink({
              type: 'BLOB',
              prefix: file.prefix,
              name: file.name,
            });

            return (
              <TableRow key={`UploadModal-${file.name}`}>
                <TableCell className="w-4">
                  <FileIcon className="size-4" />
                </TableCell>
                <TableCell>
                  <FileBreadcrumbs
                    prefix={file.prefix}
                    variant="compact"
                    className="text-xs"
                  />
                  <Link className="font-bold" href={href}>
                    {file.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right text-xs">
                  {file.error ? error : fallback}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
