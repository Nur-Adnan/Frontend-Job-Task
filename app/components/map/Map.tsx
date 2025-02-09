"use client";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import * as turf from "@turf/turf";

import L, { LatLngExpression } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useDispatch, useSelector } from "react-redux";
import {
  POLYGON_ADDED,
  POLYGON_AREA_EDITED,
  POLYGON_DELETED,
} from "@/app/redux/features/map/types";
import toast, { Toaster } from "react-hot-toast";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// Define types
interface LatLng {
  lat: number;
  lng: number;
}

interface PolygonData {
  id: number;
  latlngs: LatLng[];
  area: string;
  strokeColor?: string;
  fillColor?: string;
}

interface MapState {
  mapData: PolygonData[];
}

function MapUpdater({ position }: { position: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return null;
}

const calculatePolygonArea = (latlngs: LatLng[]): string => {
  const coordinates = latlngs.map(({ lat, lng }) => [lng, lat]);
  coordinates.push(coordinates[0]);

  const polygon = turf.polygon([coordinates]);
  const area = turf.area(polygon);
  return area.toFixed(2);
};

const calculateCenter = (latlngs: LatLng[]): LatLngExpression | null => {
  if (latlngs.length < 3) {
    console.error("Invalid polygon: At least 3 points are required.");
    return null;
  }

  const coordinates = [
    ...latlngs.map(({ lat, lng }) => [lng, lat]),
    [latlngs[0].lng, latlngs[0].lat],
  ];

  const polygon = turf.polygon([coordinates]);
  const center = turf.center(polygon).geometry.coordinates;

  return [center[1], center[0]];
};

const redIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 45px; 
      height: 45px; 
      background-image: url('/marker.webp'); 
      background-size: cover; 
      transform: perspective(100px) rotateX(20deg); 
      border-radius: 10%;
    "></div>
  `,
  iconSize: [45, 45],
  iconAnchor: [22, 44],
  popupAnchor: [0, -40],
});

const Map: React.FC = () => {
  const [position, setPosition] = useState<LatLngExpression>([51.505, -0.09]);
  const [error] = useState<string | null>(null);
  const mapData = useSelector((state: MapState) => state.mapData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
        }
      );
    }
  }, []);

  const handlePolygonCreate = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      const latlngs = layer.getLatLngs()[0] as LatLng[];
      const area = calculatePolygonArea(latlngs);

      const newCoordinates = latlngs.map(({ lat, lng }) => [lng, lat]);
      newCoordinates.push(newCoordinates[0]);
      const newPolygon = turf.polygon([newCoordinates]);

      let overlapDetected = false;

      mapData.forEach((existingPolygon) => {
        const existingCoordinates = existingPolygon.latlngs.map(
          ({ lat, lng }) => [lng, lat]
        );
        existingCoordinates.push(existingCoordinates[0]);
        const existingTurfPolygon = turf.polygon([existingCoordinates]);

        if (turf.booleanOverlap(newPolygon, existingTurfPolygon)) {
          overlapDetected = true;
        }
      });

      if (overlapDetected) {
        toast.error("Polygon Overlapped Not Allowed!", {
          position: "bottom-center",
        });
        layer.remove();
        return;
      }

      const newPolygonData: PolygonData = {
        id: _leaflet_id,
        latlngs,
        area,
      };
      dispatch({
        type: POLYGON_ADDED,
        payload: newPolygonData,
      });
    }
  };

  const handlePolygonEdited = (e: any) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).forEach((layer: any) => {
      const updatedPolygon = {
        id: layer._leaflet_id,
        latlngs: layer.editing.latlngs[0][0] as LatLng[],
      };
      dispatch({
        type: POLYGON_AREA_EDITED,
        payload: updatedPolygon,
      });
    });
  };

  const handlePolygonDeleted = (e: any) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).forEach((layer: any) => {
      const { _leaflet_id } = layer;
      layer.remove();
      dispatch({
        type: POLYGON_DELETED,
        payload: { id: _leaflet_id },
      });
    });
  };

  return (
    <>
      <Toaster />
      {error && <div className="text-danger">{error}</div>}
      <MapContainer
        center={position as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <MapUpdater position={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapData?.map((polygon) => {
          const center = calculateCenter(polygon.latlngs);
          return (
            <React.Fragment key={polygon.id}>
              <Polygon
                positions={polygon.latlngs}
                pathOptions={{
                  color: polygon.strokeColor || "#7db5fa",
                  fillColor: polygon.fillColor || "#7db5fa",
                  fillOpacity: 0.4,
                }}
              ></Polygon>
              {center && (
                <Marker position={center as LatLngExpression} icon={redIcon}>
                  <Tooltip>Polygon Area: {polygon.area} m²</Tooltip>
                </Marker>
              )}
            </React.Fragment>
          );
        })}
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handlePolygonCreate}
            onEdited={handlePolygonEdited}
            onDeleted={handlePolygonDeleted}
            draw={{
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polygon: true,
            }}
          />
        </FeatureGroup>

        <Marker position={position}>
          <Popup>Your location is approximately here!</Popup>
        </Marker>
      </MapContainer>
    </>
  );
};

export default Map;
