import { useContext } from 'react';
import HomeTabsContext from '../contexts/HomeTabsContext';

export default function useAuthContext() {
  return useContext(HomeTabsContext);
}