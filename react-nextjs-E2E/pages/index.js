import React, { useCallback, useEffect, useState } from 'react';

import CarDropzone from '../components/CarDropZone';
import CarList from '../components/CarList';
import makeCar from '../lib/car';

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
//       <button
//         onClick={() => {
//           console.log('hello');
//           makeCar().then((val) => {
//             console.log('made car');
//           });
//         }}
//       >
//         hello
//       </button>
//
