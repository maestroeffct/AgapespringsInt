import { apiGet } from './client';

type RawAppConfigResponse = {
  success: boolean;
  data: {
    minVersion: {
      android: string;
      ios: string;
    };
    storeUrls: {
      android: string;
      ios: string;
    };
  };
  message?: string;
};

export type AppConfig = {
  minVersion: {
    android: string;
    ios: string;
  };
  storeUrls: {
    android: string;
    ios: string;
  };
};

export async function getAppConfig() {
  const response = await apiGet<RawAppConfigResponse>('/config');
  return response.data;
}
