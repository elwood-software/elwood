import {useGetRun} from '@/data/run/use-get-run';
import {Spinner} from '@elwood/ui';
import {useParams} from 'react-router-dom';

export default function RunView() {
  const params = useParams<{id: string}>();
  const query = useGetRun({id: params.id!});

  if (query.isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-12">
      <div>Status: {query.data?.status}</div>
      <div>Result: {query.data?.result}</div>
      <div>Report</div>
      <div>
        <pre>{JSON.stringify(query.data?.report, null, 2)}</pre>
      </div>
    </div>
  );
}
