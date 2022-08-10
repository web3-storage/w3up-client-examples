import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LogInScreen';

import { useContext } from 'react';

import CarListScreen from '../screens/CarListScreen';
import HomeScreen from '../screens/HomeScreen';
import PictureTakingScreen from '../screens/PictureTakingScreen';
import ImageGalleryScreen from '../screens/ImageGalleryScreen';

import { AuthSettingsContext } from '../providers/AuthSettings';

export function RootNavigation() {
  const authSettingsContext = useContext(AuthSettingsContext);

  const { settings } = authSettingsContext;

  const mainApplication = (
    <NavigationContainer>
      <AppStack.Navigator>
        <AppStack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: 'W3-Up E2E' }}
        />
        <AppStack.Screen
          name="CarListScreen"
          component={CarListScreen}
          options={{ title: 'Car list' }}
        />
        <AppStack.Screen
          name="PictureTakingScreen"
          component={PictureTakingScreen}
          options={{ title: 'Take Picture' }}
        />
        <AppStack.Screen
          name="ImageGalleryScreen"
          component={ImageGalleryScreen}
          options={{ title: 'View Gallery' }}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );

  const login = (
    <NavigationContainer>
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: 'W3-Up E2E' }}
        />
      </AuthStack.Navigator>
    </NavigationContainer>
  );

  return settings.get('email') ? mainApplication : login;
}

const AppStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
