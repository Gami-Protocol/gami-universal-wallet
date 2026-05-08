import React from 'react';
import { View } from 'react-native';

// Simple web polyfill for RefreshControl
const RefreshControl = ({ refreshing, onRefresh, ...props }: any) => {
  // On web, we just render nothing since pull-to-refresh doesn't work
  // The actual refresh can be triggered via a button if needed
  return null;
};

export default RefreshControl;
