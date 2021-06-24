import React from 'react';
import MainNavigation from './src/navigations/mainNavigation';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { BLUE } from './src/utils/commonColors';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: BLUE,
    accent: BLUE,
  },
};

export default function App(){
  return (
    <PaperProvider theme={theme}>
        <MainNavigation />
    </PaperProvider>
  )
}