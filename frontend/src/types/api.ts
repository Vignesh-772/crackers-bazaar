export interface ApiHealthResponse {
  status: string;
  message: string;
}

export interface ApiStatus {
  status: 'success' | 'error';
  message: string;
  data?: ApiHealthResponse;
  error?: string;
}