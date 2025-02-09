import {
  POLYGON_ADDED,
  POLYGON_AREA_EDITED,
  POLYGON_COLOR_EDITED,
  POLYGON_DELETED,
  POLYGON_UPDATED,
} from "./types";
interface Action {
  type: string;
  payload: any;
}

interface Polygon {
  id: number;
  latlngs?: number[];
  strokeColor?: string;
  fillColor?: string;
  name?: string;
}

const initialState: Polygon[] = [];

const mapReducer = (state = initialState, action: Action): Polygon[] => {
  switch (action.type) {
    case POLYGON_ADDED:
      return state.concat(action.payload);

    case POLYGON_AREA_EDITED: {
      const { id, latlngs } = action.payload;
      return state.map((polygon) =>
        polygon.id === id ? { ...polygon, latlngs } : polygon
      );
    }

    case POLYGON_COLOR_EDITED: {
      const { id, colorType, colorValue } = action.payload;
      const colorKey = colorType === "stroke" ? "strokeColor" : "fillColor";

      return state.map((polygon) =>
        polygon.id === id ? { ...polygon, [colorKey]: colorValue } : polygon
      );
    }

    case POLYGON_DELETED: {
      const { id } = action.payload;
      return state.filter((polygon) => polygon.id !== id);
    }

    case POLYGON_UPDATED: {
      const { id, name } = action.payload;
      return state.map((polygon) =>
        polygon.id === id ? { ...polygon, name } : polygon
      );
    }

    default:
      return state;
  }
};

export default mapReducer;
