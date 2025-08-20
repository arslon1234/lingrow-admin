declare interface VehicleDashboard {
  id: string;
  totalEngineHours: number;
  engineOdometer: number;
  engineSpeed: number;
  engineFuelRate: number;
  fuelLevelPercent: number;
  fuelLevel2Percent: number;
  defLevelPercent: number;
  barometricPressure: number;
  oilPressure: number;
  coolantTemperature: number;
  ambientTemperature: number;
  oilTemperature: number;
  engineFuelEconomy: number;
  eldType: string;
  seatbeltStatus: string;
  gear: string;
  totalPtoTime: number;
  totalEngineIdleTime: number;
  totalEngineIdleFuel: number;
  totalFuelUsed: number;
  createdAt: string;
}

declare interface VehicleDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface SeriesItem {
  timestamp: string;
  value: number;
}

interface ChartStatistics {
  average: number;
  highest: number;
  lowest: number;
}

declare interface ChartMetrics {
  series: SeriesItem[];
  statistics: ChartStatistics;
}