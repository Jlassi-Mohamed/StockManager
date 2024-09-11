import { useMemo } from 'react';
import { getUserPermissions } from '../utils/utils';

const useHasPermission = (requiredPermission) => {
    const permissions = useMemo(() => {
      const userPermissions = getUserPermissions();
      return userPermissions || []; 
    }, []);
  
    return permissions.includes(requiredPermission);
  };
  
  export default useHasPermission;