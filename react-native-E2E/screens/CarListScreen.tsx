import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

import CarList from './../components/CarList'
import ID from './../components/ID'
import theme from '../theme'

import { createCar } from '../lib/car.js'
import { useUploader } from '../providers/Uploader'

export default function CarListScreen({ navigation }) {
  const uploader = useUploader()

  return (
    <SafeAreaView style={theme.container}>
      <TouchableOpacity
        onPress={async () => {
          const car = await createCar()
          uploader.upload(car).then((response) => {
            console.log(response)
          })
        }}
      >
        <Text>press me</Text>
      </TouchableOpacity>

      <ID />
      <CarList />
    </SafeAreaView>
  )
}
