import { BaseService } from "./BaseService";
import { Try, Group, Competition, CompetitionStatistics } from "@/models";

interface RateLimitResponse {
  is_correct?: boolean;
  error?: string;
  wait_time_seconds?: number;
}

export class CompetitionsService extends BaseService {
  /** [GET] /competitions/ */
  public async fetchAll(): Promise<Competition[]> {
    return this.get<Competition[]>("/competitions/");
  }

  /** [GET] /competitions/user */
  public async fetchAllFromUser(): Promise<Competition[]> {
    return this.get<Competition[]>("/competitions/user");
  }

  /** [POST] /competitions/ */
  public async create(
    title: string,
    description: string,
    catalog_theme: string,
    catalog_id: string,
    show: boolean,
    finished: boolean,
    groups_ids: string[]
  ): Promise<Competition> {
    return this.post<Competition>("/competitions/", {
      title,
      description,
      catalog_theme,
      catalog_id,
      show,
      finished,
      groups_ids,
    });
  }

  /** [GET] /competitions/{competitionID} */
  public async fetchByID(competitionID: string): Promise<Competition> {
    return this.get<Competition>(`/competitions/${competitionID}`);
  }

  /** [PUT] /competitions/{competitionID} */
  public async update(
    competitionID: string,
    title: string,
    description: string,
    catalog_theme: string,
    catalog_id: string,
    show: boolean,
    finished: boolean,
    groups_ids: string[]
  ): Promise<Competition> {
    return this.put<Competition>(`/competitions/${competitionID}`, {
      title,
      description,
      catalog_theme,
      catalog_id,
      show,
      finished,
      groups_ids,
    });
  }

  /** [DELETE] /competitions/${competitionID} */
  public async remove(competitionID: string): Promise<void> {
    return this.delete<void>(`/competitions/${competitionID}`);
  }

  /** [POST] /competitions/{competitionID}/puzzles/{puzzleID}/submit */
  public async trySubmitSolution(
    competition_id: string,
    puzzle_difficulty: string,
    puzzle_id: string,
    puzzle_index: number,
    solution: string,
    puzzle_step: number
  ): Promise<RateLimitResponse> {
    return this.post<RateLimitResponse>(`/competitions/answer_puzzle`, {
      competition_id,
      puzzle_difficulty,
      puzzle_id,
      puzzle_index,
      solution,
      puzzle_step,
    });
  }

  /** [GET] /competitions/{competitionID}/puzzles/{puzzleID}/results */
  public async fetchLeaderboard(competitionID: string): Promise<string[]> {
    return this.get<string[]>(`/competitions/${competitionID}/leaderboard`);
  }

  /** [GET] competitions/{id}/tries */
  public async fetchTries(competitionID: string): Promise<Try[]> {
    return this.get<Try[]>(`/competitions/${competitionID}/tries`);
  }

  /** [GET] /competitions/{competitionID}/users/{userID}/tries */
  public async fetchTriesByUserID(
    competitionID: string,
    userID: string
  ): Promise<Try[]> {
    return this.get<Try[]>(
      `/competitions/${competitionID}/users/${userID}/tries`
    );
  }

  /** [GET] /competitions/{competitionID}/permission/puzzles/{puzzleIndex} */
  public async checkPuzzlePermission(
    competitionID: string,
    puzzleIndex: number
  ): Promise<{ is_allowed: boolean }> {
    return this.get<{ is_allowed: boolean }>(
      `/competitions/${competitionID}/permission/puzzles/${puzzleIndex}`
    );
  }

  /** [GET] /competitions/{competitionID}/puzzles/{puzzleID}/{puzzleIndex}/tries */
  public async fetchPuzzleTries(
    competitionID: string,
    puzzleID: string,
    puzzleIndex: number
  ): Promise<Try[]> {
    return this.get<Try[]>(
      `/competitions/${competitionID}/puzzles/${puzzleID}/${puzzleIndex}/tries`
    );
  }

  /** [POST] /competitions/input */
  public async getCompetitionPuzzleInput(
    competition_id: string,
    puzzle_difficulty: string,
    puzzle_id: string,
    puzzle_index: number
  ): Promise<{ input_lines: string[] }> {
    return this.post<{ input_lines: string[] }>(`/competitions/input`, {
      competition_id,
      puzzle_difficulty,
      puzzle_id,
      puzzle_index,
    });
  }

  /** [GET] /competitions/{id}/groups */
  public async fetchGroups(competitionID: string): Promise<Group[]> {
    return this.get<Group[]>(`/competitions/${competitionID}/groups`);
  }

  /** [GET] /competitions/{id}/statistics */
  public async fetchStatistics(
    competitionID: string
  ): Promise<CompetitionStatistics> {
    return this.get<CompetitionStatistics>(
      `/competitions/${competitionID}/statistics`
    );
  }

  /** [PUT] /competitions/{id}/visibility */
  public async updateVisibility(
    competitionID: string,
    is_visible: boolean
  ): Promise<void> {
    return this.put<void>(`/competitions/${competitionID}/visibility`, {
      is_visible,
    });
  }

  /** [PUT] /competitions/{id}/finish */
  public async finishCompetition(competitionID: string): Promise<void> {
    return this.put<void>(`/competitions/${competitionID}/finish`);
  }

  /** [GET] /competitions/{competitionId}/export */
  public async getResumeExportXLSX(competitionID: string): Promise<void> {
    const res = await this.getBlob(`/competitions/${competitionID}/export`);
    const blob = new Blob([res], {
      type: "application/vnd.ms-excel",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `competition_${competitionID}_data.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /** [GET] /competitions/${competitionID}/tries/ldb */
  public async fetchLeaderboardTries(competitionID: string): Promise<Try[]> {
    return this.get<Try[]>(`/competitions/${competitionID}/tries/ldb`);
  }
}

// Create singleton instance
export const competitionsService = new CompetitionsService();
