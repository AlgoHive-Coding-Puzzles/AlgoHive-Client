import { User } from "./User";

export interface Try {
  id: string;
  puzzle_id: string;
  puzzle_index: number;
  puzzle_lvl: string;
  step: number;
  start_time: string;
  end_time?: string;
  attempts: number;
  score: number;
  last_move_time?: string;
  last_answer?: string;
  competition_id: string;
  user_id: string;
  user?: User;
}
