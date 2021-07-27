//react
import ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
//mapbox
import mapboxgl from "mapbox-gl";
//material-ui
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
//axios
import axios from 'axios';
//chartjs
import { Pie } from 'react-chartjs-2';

//api
import { api } from './api';
//constants
import { Color_02, Color_1 } from './constants/colors';

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
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    //chart data
    const [chartData, setChartData] = useState({})

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

    /**
     * debounce to prevent multiple extra request to API
     */
    useEffect(() => {
        // if(!open) return;

        if(!inputValue) {
            // setOptions([]);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            getData();
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [inputValue])

    /**
     * update chart and map when selected countries is changed
     */
    useEffect(() => {
        // if(selectedOptions.length === 0) return;

        //highlight selected countries
        if(map.isStyleLoaded()){
            if(!map.getLayer('country-selected')){
              map.addLayer(
                {
                  id: 'country-selected',
                  source: {
                    type: 'vector',
                    url: 'mapbox://mapbox.country-boundaries-v1',
                  },
                  'source-layer': 'country_boundaries',
                  type: 'fill',
                  paint: {
                    'fill-color': '#d2361e',
                    'fill-opacity': 1,
                  },
                },
                'country-label'
              );
            }
        }
        showChart();
    }, [selectedOptions]);

    const getData = async () => {
        try{
            setLoading(true);
            const res = await axios.get(api.countriesList+inputValue)
            if(res.status === 200){
                setOptions(res.data);
            } 
            setLoading(false);
        } catch (e) {
            setLoading(false);     
        }        
    }

    const showChart = () => {
        const data = {
         labels: selectedOptions.map(v => v.name),
         datasets: [
           {
             label: 'population',
             data: selectedOptions.map(v => v.population),
             backgroundColor: Color_02,
             borderColor: Color_1,
             borderWidth: 1,
           },
         ],
       };
       setChartData(data);
     }

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
                {chartData.datasets && <div className="chart">
                    <h3>population chart:</h3>
                    <Pie data={chartData}  options={{
                        responsive: true
                        }} />
                </div>}
            </div>
            <div ref={mapContainerRef} className="map-container" />
        </>
    )
}

export default App;