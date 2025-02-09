import {
  POLYGON_ADDED,
  POLYGON_COLOR_EDITED,
  POLYGON_DELETED,
  POLYGON_UPDATED,
} from "./types";

// Use type aliases for frequently used types
type ColorType = "stroke" | "fill";
type PolygonColorEditPayload = {
  id: number;
  colorType: ColorType;
  colorValue: string;
};
type PolygonUpdatePayload = { id: number; name: string };

interface Polygon {
  id: number;
  latlngs?: number[];
  strokeColor?: string;
  fillColor?: string;
  name?: string;
}

// Use union type for better type checking performance
export type Action =
  | { type: typeof POLYGON_ADDED; payload: Polygon[] }
  | { type: typeof POLYGON_COLOR_EDITED; payload: PolygonColorEditPayload }
  | { type: typeof POLYGON_DELETED; payload: number }
  | { type: typeof POLYGON_UPDATED; payload: PolygonUpdatePayload };

// Optimize polygonAdded to always use array for consistent reducer handling
export const polygonAdded = (polygon: Polygon | Polygon[]): Action => ({
  type: POLYGON_ADDED,
  payload: Array.isArray(polygon) ? polygon : [polygon],
});

// Precompute common payload shapes where possible
const createColorEditPayload = (
  id: number,
  colorType: ColorType,
  colorValue: string
): PolygonColorEditPayload => ({ id, colorType, colorValue });

export const polygonColorEdited = (
  id: number,
  colorType: ColorType,
  colorValue: string
): Action => ({
  type: POLYGON_COLOR_EDITED,
  payload: createColorEditPayload(id, colorType, colorValue),
});

// Direct primitive return for delete action
export const polygonDeleted = (polygonId: number): Action => ({
  type: POLYGON_DELETED,
  payload: polygonId,
});

// Reuse payload type definition
export const polygonUpdated = (id: number, name: string): Action => ({
  type: POLYGON_UPDATED,
  payload: { id, name },
});
