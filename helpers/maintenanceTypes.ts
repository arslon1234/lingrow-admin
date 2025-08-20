export const getMaintenanceTypeName = (id: string, maintenanceTypes: MaintenanceTypesResponse[]) => {
   const maintenanceType = maintenanceTypes.find(maintenanceType => maintenanceType.id === id);
   if (maintenanceType) {
      const name = maintenanceType.name;
      return maintenanceType.name;
   }
   return "";
}