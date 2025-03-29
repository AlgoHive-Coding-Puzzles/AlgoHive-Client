import { BaseService } from "./BaseService";
import { Catalog, Puzzle, Theme } from "../models/Catalogs";

export class CatalogsService extends BaseService {
  /** [GET] /catalogs/ */
  public async fetchCatalogs(): Promise<Catalog[]> {
    return this.get<Catalog[]>("/catalogs/");
  }

  /** [GET] /catalogs/{catalogID} */
  public async getCatalogByID(catalogID: string): Promise<Catalog> {
    const res = await this.get<{ data: Catalog[] }>(`/catalogs/${catalogID}`);
    return res.data.find((catalog) => catalog.id === catalogID) as Catalog;
  }

  /** [GET] /catalogs/{catalogID}/themes */
  public async fetchCatalogThemes(catalogID: string): Promise<Theme[]> {
    return this.get<Theme[]>(`/catalogs/${catalogID}/themes`);
  }

  /** [GET] /catalogs/{catalogID}/themes/{themeID} */
  public async fetchCatalogThemeDetails(
    catalogID: string,
    themeID: string
  ): Promise<Theme> {
    return this.get<Theme>(`/catalogs/${catalogID}/themes/${themeID}`);
  }

  /** [GET] /catalogs/{catalogID}/themes/{themeID}/puzzles */
  public async fetchPuzzleDetails(
    catalogID: string,
    themeID: string,
    puzzleIndex: string
  ): Promise<Puzzle> {
    return this.get<Puzzle>(
      `/catalogs/${catalogID}/themes/${themeID}/puzzles/${puzzleIndex}`
    );
  }
}

// Create singleton instance
export const catalogsService = new CatalogsService();
