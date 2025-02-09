import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div class="loading-container">
      <div class="spinner"></div>
      <div class="loading-text">Loading...</div>
    </div>
  ),
});

export { Map };
