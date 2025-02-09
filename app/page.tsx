import ExportImport from "@/app/components/ExportImport";
import { Map } from "@/app/components/map";
import PolygonList from "@/app/components/Polygon";

export default function Home() {
  return (
    <div className="main-container">
      <div className="map-column-wrapper">
        <ExportImport />
        <Map />
      </div>
      <div className="polygon-list-wrapper">
        <PolygonList />
      </div>
    </div>
  );
}
