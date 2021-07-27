import React from 'react';

const Popup = ({ feature, lngLat }) => {
  const { name_en, region } = feature.properties;

  return (
    <div>
      <h3>{name_en}</h3>
      <b>region:</b>{region}<br />
      {lngLat.lng && <><b>lng:</b>{lngLat.lng.toFixed(2)}  <b> / lat:</b>{lngLat.lat.toFixed(2)}</>}
    </div>
  );
};

export default Popup;