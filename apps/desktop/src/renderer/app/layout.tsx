import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="grid grid-cols-[80px_auto] w-full">
      <div className="bg-red-200 pt-10">menu</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
