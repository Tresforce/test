export interface PostgresConnectionOptions {
  type: string;
  host: string;
  port: number;
  password: string;
  username: string;
  logging: string[];
  synchronize: boolean;
  entities: any;
  database?: string;
}
