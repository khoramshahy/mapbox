//react
import ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
//mapbox
import mapboxgl from "mapbox-gl";
//material-ui
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
//css
import './App.css'

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hraG9yYW1zaGFoeSIsImEiOiJja3JoZ2h5YXYwOHM4MzFwZTdmNzlveHNvIn0.Wxyw-A9q1bXv-Y6UbggPDw';
var map;


const App = () => {
    //mapbox
    const mapContainerRef = useRef(null);
    //autocomplete
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([{name: 'sss'},{name: 'fff'},{name: 'ggg'},{name: 'jjj'}]);
    const [selectedOptions, setSelectedOptions] = useState([{name: 'ggg'},{name: 'jjj'},]);
    const [loading, setLoading] = useState(false);

    // initialize map when component mounts
  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-day-v1",
    //   zoom: 0,
    //   center:[0,0]
    });

    map.fitBounds([
        [180, 90], // southwestern corner of the bounds
        [-160,-60] // northeastern corner of the bounds
        ]);
  
      // add navigation control (zoom buttons)
      map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      map.addControl(new mapboxgl.FullscreenControl());
  
      map.on("load", () => {
        map.getCanvas().style.cursor = "auto"; 
      });
  
    // clean up on unmount
    return () => map.remove();
  }, []); 

    return (
        <>
            <div className="sidebar">
                <Autocomplete
                    id="countries-list"
                    multiple
                    className="auto-complete"
                    loadingText="Searching..."
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    onChange={(event, newValue) => {
                        setSelectedOptions(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => option.name}
                    autoHighlight
                    filterSelectedOptions
                    options={options}
                    loading={loading}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="choose country"
                        variant="outlined"
                        InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                        }}
                    />
                    )}
                />
            </div>
            <div ref={mapContainerRef} className="map-container" />
        </>
    )
}

export default App;