const POLYGON_EVENTS = {
  ADDED: "polygon_added",
  AREA_EDITED: "polygon_area_edited",
  COLOR_EDITED: "polygon_color_edited",
  DELETED: "polygon_deleted",
  UPDATED: "polygon_updated",
} as const;

export const POLYGON_ADDED = POLYGON_EVENTS.ADDED;
export const POLYGON_AREA_EDITED = POLYGON_EVENTS.AREA_EDITED;
export const POLYGON_COLOR_EDITED = POLYGON_EVENTS.COLOR_EDITED;
export const POLYGON_DELETED = POLYGON_EVENTS.DELETED;
export const POLYGON_UPDATED = POLYGON_EVENTS.UPDATED;

export type Types = (typeof POLYGON_EVENTS)[keyof typeof POLYGON_EVENTS];
