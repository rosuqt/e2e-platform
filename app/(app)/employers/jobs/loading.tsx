// app/employers/loading.tsx
import CenteredLoader from "../../test/loader-smiley";

export default function Loading() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <CenteredLoader />
    </div>
  );
}
