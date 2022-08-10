import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useUploader } from '../providers/Uploader';

export default function CarList() {
  const uploader = useUploader();
  const [list, setList] = useState(['uploads']);

  useEffect(() => {
    if (!uploader) {
      setList(['loading...']);
    } else {
      console.log('making call to server for list');
      uploader
        .list()
        .then((data) => {
          console.log('got list from server', data);
          setList(data || []);
        })
        .catch((error) => {
          console.log('error fetching list:', error);
        });
    }
  }, [uploader]);

  return (
    <FlatList
      data={list.map((x) => ({
        key: x,
      }))}
      renderItem={({ item }) => <Text>{item.key}</Text>}
    />
  );
}
