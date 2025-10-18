import { HistoryContext } from '@/context/history.context';
import React from 'react';

const useHistory = () => {
  const context = React.useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be within a HistoryProvider!');
  }
  return context;
};

export default useHistory;
