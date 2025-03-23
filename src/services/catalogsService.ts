import { Catalog, Puzzle, Theme } from "../models/Catalogs";
import { ApiClient } from "../config/ApiClient";

export async function fetchCatalogs(): Promise<Catalog[]> {
  try {
    const response = await ApiClient.get("/catalogs/");
    if (response.status !== 200) {
      throw new Error(`Erreur: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    throw error;
  }
}

export async function fetchCatalogById(id: string): Promise<Catalog> {
  try {
    const response = await ApiClient.get(`/catalogs`);

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return response.data.find((catalog: Catalog) => catalog.id === id);
  } catch (error) {
    console.error("Error fetching catalog by id:", error);
    throw error;
  }
}

export async function fetchCatalogThemes(catalogId: string): Promise<Theme[]> {
  try {
    const response = await ApiClient.get(`/catalogs/${catalogId}/themes`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching catalog themes:", error);
    throw error;
  }
}

export async function fetchCatalogThemeDetails(
  catalogId: string,
  themeId: string
): Promise<Theme> {
  try {
    const response = await ApiClient.get(
      `/catalogs/${catalogId}/themes/${themeId}`
    );
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching catalog theme details:", error);
    throw error;
  }
}

export async function fetchPuzzleDetails(
  catalogId: string,
  themeId: string,
  puzzleId: string
): Promise<Puzzle> {
  try {
    const response = await ApiClient.get(
      `/catalogs/${catalogId}/themes/${themeId}/puzzles/${puzzleId}`
    );
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching puzzle details:", error);
    throw error;
  }
}

export async function fetchPuzzleInput(
  catalogId: string,
  themeName: string,
  puzzleId: string,
  inputId: string
): Promise<{ input_lines: string[] }> {
  try {
    const response = await ApiClient.get(
      `/catalogs/${catalogId}/themes/${themeName}/puzzles/${puzzleId}/inputs/${inputId}`
    );
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching puzzle input:", error);
    throw error;
  }
}
