import { Catalog } from "./Catalogs";
import { Group } from "./Group";
import { Try } from "./Try";

export interface Competition {
  id: string;
  title: string;
  description: string;
  finished: boolean;
  show: boolean;
  catalog_theme: string;
  catalog_id: string;
  catalog?: Catalog;
  groups?: Group[];
  tries: Try[];
}

export interface CompetitionStatistics {
  competition_id: string;
  title: string;
  total_users: number;
  active_users: number;
  completion_rate: number;
  average_score: number;
  highest_score: number;
}
