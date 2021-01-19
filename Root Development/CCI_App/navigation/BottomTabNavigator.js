import React from 'react';
import {View,Text} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import ScreenOne from '../screens/HomeScreen';
import ScreenTwo from '../screens/PlaceholderScreen';

const BottomTabNavigator = createBottomTabNavigator({
  One: ScreenOne,
  Two: ScreenTwo
});

export default BottomTabNavigator;
