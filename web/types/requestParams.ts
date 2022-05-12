export interface Query {
  where?: {
    [key: string]: any;
  };
  populate?: string | string[];
  limit?: number;
  sort?: string;
  page?: number;
}
