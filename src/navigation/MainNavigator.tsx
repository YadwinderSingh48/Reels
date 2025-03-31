import { StyleSheet } from 'react-native';
import React, { FC } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { mergedStack } from './ScreenCollection';
import { UploadProvider } from '../components/uploadservice/uploadContext';

const MainNavigator:FC = () => {
  const Stack = createNativeStackNavigator();
  return (
    <UploadProvider>
    <Stack.Navigator initialRouteName='SplashScreen'
      screenOptions={{
          headerShown: false
      }}
    >
      {
        mergedStack?.map((item,index) => (
          <Stack.Screen key={index} name={item?.name} component={item?.component} />
        ))
      }
    </Stack.Navigator>
    </UploadProvider>
  )
}

export default MainNavigator

const styles = StyleSheet.create({})