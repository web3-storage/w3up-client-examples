import React, { useCallback, useEffect, useState } from 'react';

import CarDropzone from '../components/CarDropZone';
import CarList from '../components/CarList';

export default function App() {
  const [readout, setReadout] = useState(JSON.stringify({}));

  return (
    <div className="App">
      <CarList />
      <CarDropzone
        onUploaded={(data) => {
          setReadout(JSON.stringify(data, null, 2));
        }}
      />
      <pre>
        <code>{readout}</code>
      </pre>
    </div>
  );
}
