import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useUploader } from '../providers/Uploader';

export default function ID() {
  const uploader = useUploader();
  const [id, setId] = useState('loading...');
  const [account, setAccount] = useState('loading...');

  useEffect(() => {
    if (uploader) {
      console.log('making call to server for id/account');
      uploader.identity().then((data) => {
        setId(data?.did() || 'Not logged in.');
      });
      uploader
        .whoami()
        .then((data) => {
          console.log('got id from server', data);
          if (data.error) {
            setAccount(
              'error, not registered, registration flow not setup yet'
            );
          } else {
            setAccount(data || 'error');
          }
        })
        .catch((error) => {
          console.log('error fetching id:', error);
        });
    }
  }, [uploader]);

  return (
    <View>
      <Text>{`did-key: ${id}`}</Text>
      <Text>{`did-account: ${account}`}</Text>
    </View>
  );
}
