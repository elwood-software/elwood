import {Link} from '@/components/link';
import {useGetRuns} from '@/data/run/use-get-runs';
import {toArray} from '@elwood/common';
import {Button} from '@/components/button';

export default function RunHome() {
  const query = useGetRuns();
  const runs = toArray(query.data);

  return (
    <>
      <div></div>
      <div className="grid grid-cols-2 w-full">
        <div>
          {runs.map(item => {
            return (
              <Link key={item.id} href={`/run/${item.id}`}>
                {item.id} {item.num}
              </Link>
            );
          })}
        </div>
        <div>
          <Button href="/run/new">Start New Run</Button>
        </div>
      </div>
    </>
  );
}
