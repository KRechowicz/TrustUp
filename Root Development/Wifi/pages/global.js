import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

const getScreenInfo = () => {
  const dim = Dimensions.get('window');
  return dim;
}

const bindScreenDimensionsUpdate = (component) => {
  Dimensions.addEventListener('change', () => {
    try{
      component.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape',
        screenWidth: getScreenInfo().width,
        screenHeight: getScreenInfo().height
      });
    }catch(e){
      // Fail silently
    }
  });
}