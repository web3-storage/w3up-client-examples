import React, { useEffect, useState } from 'react';
import { useUploader } from '../providers/Uploader';

export default function CarListItem({ value }) {
  const uploader = useUploader();
  const [insights, setInsights] = useState({});

  useEffect(() => {
    uploader?.insights(value)?.then(setInsights);
  }, [uploader, value]);

  return (
    <div>
      <div>cid: {value}</div>
      <pre>insights: {JSON.stringify(insights, null, 2)}</pre>
    </div>
  );
}
