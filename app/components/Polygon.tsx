"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  POLYGON_COLOR_EDITED,
  POLYGON_DELETED,
  POLYGON_UPDATED,
} from "@/app/redux/features/map/types";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";
import { RootState } from "@/app/redux/store";
import {
  Moon,
  Sun,
  Search,
  Edit2,
  Trash2,
  PenTool,
  PlugIcon as Fill,
} from "lucide-react";

interface Polygon {
  id: number;
  name?: string;
  stroke?: string;
  fill?: string;
}

type ColorType = "stroke" | "fill" | "";

export default function PolygonList(): JSX.Element {
  const mapData = useSelector((state: RootState) => state.mapData);
  const dispatch = useDispatch();

  const [activePolygon, setActivePolygon] = useState<number | null>(null);
  const [colorType, setColorType] = useState<ColorType>("");
  const [color, setColor] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const filteredPolygons = mapData.filter(
    (polygon: Polygon) =>
      polygon.id.toString().includes(searchTerm) ||
      (polygon.name &&
        polygon.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const applyColorChange = (polygonId: number): void => {
    if (color) {
      dispatch({
        type: POLYGON_COLOR_EDITED,
        payload: {
          id: polygonId,
          colorType,
          colorValue: color,
        },
      });
      resetState();
    }
  };

  const deletePolygon = (polygonId: number): void => {
    dispatch({
      type: POLYGON_DELETED,
      payload: { id: polygonId },
    });
  };

  const updatePolygon = (polygonId: number): void => {
    if (editName.trim()) {
      dispatch({
        type: POLYGON_UPDATED,
        payload: { id: polygonId, name: editName },
      });
      setEditMode(null);
    }
  };

  const resetState = (): void => {
    setActivePolygon(null);
    setColor("");
    setColorType("");
  };

  const toggleDarkMode = (): void => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className={`polygon-list ${darkMode ? "dark-mode" : ""}`}>
      <div className="polygon-list__header">
        <h2 className="polygon-list__title">Polygon List</h2>
        <button className="polygon-list__theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {mapData.length > 0 && (
        <div className="polygon-list__search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by Polygon ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {filteredPolygons.length === 0 ? (
        <p className="polygon-list__empty">
          {mapData.length > 0
            ? "No matching polygons found."
            : "No polygons available."}
        </p>
      ) : (
        <ul className="polygon-list__items">
          {filteredPolygons.map((polygon: Polygon) => (
            <li key={polygon.id} className="polygon-item">
              <div className="polygon-item__info">
                {editMode === polygon.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="polygon-item__edit-input"
                  />
                ) : (
                  <span>
                    Polygon ID: {polygon.id}{" "}
                    {polygon.name && `(${polygon.name})`}
                  </span>
                )}
              </div>
              <div className="polygon-item__actions">
                <button
                  onClick={() => {
                    setActivePolygon(polygon.id);
                    setColorType("stroke");
                  }}
                  className="polygon-item__button polygon-item__button--stroke"
                >
                  <PenTool size={16} />
                  <span>Stroke</span>
                </button>
                <button
                  onClick={() => {
                    setActivePolygon(polygon.id);
                    setColorType("fill");
                  }}
                  className="polygon-item__button polygon-item__button--fill"
                >
                  <Fill size={16} />
                  <span>Fill</span>
                </button>
                <button
                  onClick={() => deletePolygon(polygon.id)}
                  className="polygon-item__button polygon-item__button--delete"
                >
                  <Trash2 size={16} />
                </button>
                {editMode === polygon.id ? (
                  <button
                    onClick={() => updatePolygon(polygon.id)}
                    className="polygon-item__button polygon-item__button--save"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(polygon.id);
                      setEditName(polygon.name || "");
                    }}
                    className="polygon-item__button polygon-item__button--edit"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {activePolygon === polygon.id && (
                  <div className="color-picker">
                    <HexAlphaColorPicker color={color} onChange={setColor} />
                    <HexColorInput
                      color={color}
                      onChange={setColor}
                      placeholder="HEX Color Code"
                    />
                    <div className="color-picker__actions">
                      <button
                        onClick={resetState}
                        className="color-picker__button color-picker__button--cancel"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => applyColorChange(polygon.id)}
                        className="color-picker__button color-picker__button--apply"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
