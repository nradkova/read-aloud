import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';

import './index.css';
import { DEFAULT_LAG_LTD, DEFAULT_MAP_CENTER, DEFAULT_MAP_CENTER_CITY } from '../../constants/common';


const MapComponent = ({ getGeoPoint }) => {
  const [point, setPoint] = useState(DEFAULT_LAG_LTD);

  useMapEvent('click', (e) => {
    if (!getGeoPoint) {
      return null;
    }
    const data = [e.latlng.lat, e.latlng.lng];
    getGeoPoint(data);
    setPoint(data);
  })
  return (
    <Marker position={point} >
      <Popup>
        New Location <br />{point[0].toString().slice(0, 7)}, {point[1].toString().slice(0, 7)}
      </Popup>
    </Marker>
  )
}


const MapEvent = ({ getGeoPoint, center, message }) => {
  return (
    <div className="map-event">
      <MapContainer center={center || DEFAULT_MAP_CENTER} zoom={8} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center || DEFAULT_MAP_CENTER}>
          <Popup>
            {message && center
              ? <span> {message} <br /> {center[0].toString().slice(0, 7)}, {center[1].toString().slice(0, 7)} </span>
              : DEFAULT_MAP_CENTER_CITY
            }
          </Popup>
        </Marker>
        <MapComponent getGeoPoint={getGeoPoint} />
      </MapContainer>
    </div>
  )
}

export default MapEvent;
