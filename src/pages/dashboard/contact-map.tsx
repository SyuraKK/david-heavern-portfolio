import 'leaflet/dist/leaflet.css';

import type { ChangeEvent } from 'react';
import type { LatLngExpression } from 'leaflet';

import L from 'leaflet';
import { useState, useEffect } from 'react';
import { Popup, useMap, Marker, TileLayer, ScaleControl, MapContainer } from 'react-leaflet';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { MAP_STYLES, type MapStyleKey } from 'src/components/map/map-styles';

type ContactMapProps = {
  address: string;
  searchAddress: string;
};

type PhotonResponse = {
  features?: Array<{ geometry?: { coordinates?: [number, number] } }>;
};

const addressIcon = L.divIcon({
  className: 'contact-leaflet-marker',
  html: '<span></span>',
  iconSize: [34, 42],
  iconAnchor: [17, 42],
});

const userIcon = L.divIcon({
  className: 'contact-leaflet-user-marker',
  html: '<span></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapActions({
  onLocationChange,
  onLocationError,
}: {
  onLocationChange: (location: [number, number]) => void;
  onLocationError: (message: string) => void;
}) {
  const map = useMap();

  const locateUser = () => {
    if (!navigator.geolocation) {
      onLocationError('Location services are not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location: [number, number] = [coords.latitude, coords.longitude];
        onLocationChange(location);
        map.flyTo(location, Math.max(map.getZoom(), 15), { duration: 1.2 });
      },
      (error) => onLocationError(error.message || 'Unable to find your current location.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleFullscreen = () => {
    const container = map.getContainer();
    if (document.fullscreenElement === container) {
      void document.exitFullscreen().catch((error: unknown) => {
        onLocationError(error instanceof Error ? error.message : 'Unable to exit fullscreen.');
      });
    } else if (container.requestFullscreen) {
      void container.requestFullscreen().catch((error: unknown) => {
        onLocationError(error instanceof Error ? error.message : 'Unable to enter fullscreen.');
      });
    } else {
      onLocationError('Fullscreen mode is not available in this browser.');
    }
  };

  return (
    <div className="contact-leaflet-actions" aria-label="Map actions">
      <button
        type="button"
        aria-label="Find my location"
        title="Find my location"
        onClick={locateUser}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Toggle map fullscreen"
        title="Toggle fullscreen"
        onClick={toggleFullscreen}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
          <path d="m3 3 6 6m12-6-6 6M3 21l6-6m12 6-6-6" />
        </svg>
      </button>
    </div>
  );
}

function AddressFocus({ coordinates }: { coordinates: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, 15, { duration: 1.2 });
    }
  }, [coordinates, map]);

  return null;
}

export default function ContactMap({ address, searchAddress }: ContactMapProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<MapStyleKey>('light');

  const handleStyleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === 'light' || value === 'dark' || value === 'neutral') {
      setSelectedStyle(value);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ q: searchAddress, limit: '1' });

    fetch(`https://photon.komoot.io/api/?${query}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Location lookup failed (${response.status})`);
        }
        return response.json() as Promise<PhotonResponse>;
      })
      .then((result) => {
        const point = result.features?.[0]?.geometry?.coordinates;
        if (!point || !Number.isFinite(point[0]) || !Number.isFinite(point[1])) {
          throw new Error('No map location was found for this address.');
        }
        setCoordinates([point[1], point[0]]);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setLocationError(
          error instanceof Error ? error.message : 'Unable to locate this address on the map.'
        );
      });

    return () => controller.abort();
  }, [searchAddress]);

  const mapCenter: LatLngExpression = coordinates ?? [33.749, -84.388];

  return (
    <div className="contact-map-frame">
      <MapContainer
        center={mapCenter}
        zoom={coordinates ? 15 : 12}
        maxZoom={19}
        minZoom={3}
        scrollWheelZoom
        zoomControl
        className="contact-leaflet-map"
        aria-label={`Interactive map centered on ${address}`}
      >
        <AddressFocus coordinates={coordinates} />
        <TileLayer
          key={selectedStyle}
          url={MAP_STYLES[selectedStyle].url}
          attribution={MAP_STYLES[selectedStyle].attribution}
          maxZoom={19}
        />
        <ScaleControl position="bottomleft" />
        <MapActions onLocationChange={setUserCoordinates} onLocationError={setLocationError} />

        {coordinates && (
          <Marker position={coordinates} icon={addressIcon}>
            <Popup>{address}</Popup>
          </Marker>
        )}
        {userCoordinates && (
          <Marker position={userCoordinates} icon={userIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="contact-map-style-panel">
        <strong>Change map</strong>
        <RadioGroup aria-label="Map style" value={selectedStyle} onChange={handleStyleChange}>
          {(Object.keys(MAP_STYLES) as MapStyleKey[]).map((style) => (
            <FormControlLabel
              key={style}
              value={style}
              label={MAP_STYLES[style].label}
              control={<Radio size="small" />}
            />
          ))}
        </RadioGroup>
      </div>
      <div className="contact-map-status" aria-live="polite">
        {locationError || (coordinates ? 'Atlanta, Georgia' : 'Finding the location…')}
      </div>
    </div>
  );
}
