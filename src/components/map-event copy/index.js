import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';
import { DEFAULT_LAG_LTD, DEFAULT_MAP_CENTER, DEFAULT_MAP_CENTER_CITY } from '../../common';

import './index.css'

const MapComponent = ({ getGeoPoint }) => {
  const [point, setPoint] = useState(DEFAULT_LAG_LTD);

  useMapEvent('click', (e) => {
    const data = [e.latlng.lat, e.latlng.lng];
    getGeoPoint(data);
    setPoint(data);
    console.log(data);
  })
  return (
    <Marker position={point} >
      <Popup>
        Your Location <br />{point[0].toString().slice(0, 7)}, {point[1].toString().slice(0, 7)}
      </Popup>
    </Marker>
  )
}

const MapEvent = ({ getGeoPoint }) => {
  // const [newPoint, setNewPoint] = useState(point);
  // console.log(newPoint);
  return (
    <div className="map-event">
      <MapContainer center={DEFAULT_MAP_CENTER} zoom={10} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={DEFAULT_MAP_CENTER}>
          <Popup>
           {DEFAULT_MAP_CENTER_CITY}
          </Popup>
        </Marker>
        <MapComponent getGeoPoint={getGeoPoint} />
      </MapContainer>
    </div>
  )
}

export default MapEvent;
