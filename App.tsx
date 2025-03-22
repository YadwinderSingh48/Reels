import 'react-native-gesture-handler';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Navigation from './src/navigation/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

GoogleSignin.configure({
  webClientId: "838439444202-27khldo3hh1i09a4vilf7nn12k8nqc83.apps.googleusercontent.com",
  forceCodeForRefreshToken: true,
  offlineAccess: false,
  iosClientId: "838439444202-1qqgpe2o4vms8k0v3iq79hlqsvflr732.apps.googleusercontent.com"
})

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor} >
          <Navigation />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  }
});