import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../features/propertiesSlice.js';
import { Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Sample data for chart
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Portfolio Value',
      data: [100000, 120000, 115000, 130000, 140000],
      fill: false,
      borderColor: '#4F46E5',
      tension: 0.1,
    },
  ],
};

// Sample data for map
const properties = [
  { id: 1, name: 'Property A', position: [37.7749, -122.4194] },
  { id: 2, name: 'Property B', position: [34.0522, -118.2437] },
];

const DashboardInner = ({ exportStatus, downloadUrl, handleExport }) => {
  const dispatch = useDispatch();
  const { items: properties, status } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  return (
    <main className="p-4 space-y-8">
      <h1 className="text-2xl font-bold" id="dashboard-title">Dashboard</h1>

      <section role="region" aria-labelledby="portfolio-performance-title">
        <h2 className="text-xl mb-2" id="portfolio-performance-title">Portfolio Performance</h2>
        <div aria-label="Line chart showing portfolio performance over time">
          <Line data={chartData} />
        </div>
      </section>

      <section role="region" aria-labelledby="properties-map-title">
        <h2 className="text-xl mb-2" id="properties-map-title">Properties Map</h2>
        {status === 'loading' && <p>Loading properties...</p>}
        {status === 'failed' && <p>Error loading properties.</p>}
        {status === 'succeeded' && (
          <MapContainer
            center={[36.7783, -119.4179]}
            zoom={5}
            style={{ height: '400px', width: '100%' }}
            aria-label="Map showing property locations"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {properties.map((property) => (
              <Marker
                key={property.id}
                position={property.position || [36.7783, -119.4179]} // fallback position
              >
                <Popup>{property.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Export Data</h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export PDF
          </button>
        </div>
        {exportStatus && <p>Status: {exportStatus}</p>}
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="text-blue-600 underline"
            download
          >
            Download Export
          </a>
        )}
      </section>
    </main>
  );
};

function DashboardWrapper() {
  const [exportStatus, setExportStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleExport = async (format) => {
    setExportStatus('Starting export...');
    setDownloadUrl('');

    try {
      const response = await fetch('/api/v1/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'USER_ID_PLACEHOLDER', // Replace with actual user ID
          filters: {}, // Add filters if needed
          format,
        }),
      });

      const data = await response.json();
      const jobId = data.jobId;
      setExportStatus('Export job enqueued. Waiting for completion...');

      // Poll for status
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`/api/v1/export/status/${jobId}`);
        const statusData = await statusRes.json();

        if (statusData.status === 'completed' && statusData.downloadUrl) {
          clearInterval(pollInterval);
          setExportStatus('Export ready!');
          setDownloadUrl(statusData.downloadUrl);
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      setExportStatus('Error starting export');
    }
  };

  return (
    <DashboardInner
      exportStatus={exportStatus}
      downloadUrl={downloadUrl}
      handleExport={handleExport}
    />
  );
}

export default DashboardWrapper;