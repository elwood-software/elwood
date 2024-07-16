import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export default function FilesHome(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/run', {replace: true});
  }, [navigate]);

  return <></>;
}
