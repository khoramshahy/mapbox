//react
import ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
//mapbox
import mapboxgl from "mapbox-gl";
//css
import './App.css'

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hraG9yYW1zaGFoeSIsImEiOiJja3JoZ2h5YXYwOHM4MzFwZTdmNzlveHNvIn0.Wxyw-A9q1bXv-Y6UbggPDw';
var map;


const App = () => {
    //mapbox
    const mapContainerRef = useRef(null);

    // initialize map when component mounts
  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-day-v1",
      zoom: 0,
      center:[0,0]
    });


    // clean up on unmount
    return () => map.remove();
  }, []); 

    return (
        <div ref={mapContainerRef} className="map-container" />
    )
}

export default App;