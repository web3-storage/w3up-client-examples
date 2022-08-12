import { useEffect, useState } from 'react';
import { useUploader } from '../providers/Uploader';
import CarListItem from './CarListItem';

export default function CarList() {
  const uploader = useUploader();
  const [list, setList] = useState([]);

  console.log('hello list', uploader);

  useEffect(() => {
    uploader?.list()?.then((data) => {
      console.log('set list');
      setList(data);
    });
  }, [uploader]);

  const listEl = list.map((cid) => <CarListItem key={cid} value={cid} />);

  return (
    <>
      <div>list:</div>
      {listEl}
    </>
  );
}
