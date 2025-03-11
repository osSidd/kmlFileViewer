import { useState } from "react";
import { parseString } from 'xml2js'
import { getDistance } from 'geolib'

import UploadKmlForm from "./components/upload-kml-form";

import 'leaflet/dist/leaflet.css'

import './App.css'
import DetailSummaryBtns from "./components/detail-summary-btn";
import SummaryTable from "./components/summary-table";
import KmlMapContainer from "./components/map-container";
import { MapContainer } from "react-leaflet";

export default function App(){

  const [summary, setSummary] = useState(null);
  const [renderTable, setRenderTable] = useState(false)
  const [details, setDetails] = useState(false)
  const [mapData, setMapData] = useState([]);
  const [length, setLength] = useState(0);

  function addKmlData(value){
    parseString(value, {explicitArray: false, trim: true}, function (err, result){
      if(err){
        console.log(err.message)
        return
      }
      else{
        const coordinates = extractCoordinates(result)
        setSummary(generateSummary(result))
        setMapData(coordinates)
        setLength(calculateTotalLength(coordinates.coordinates))
      }
    })
  }

  const extractCoordinates = (kml) => {
    const coordinates = [];
    const elements = [];

    const placemarks = kml?.kml?.Document.Placemark;

    placemarks.forEach((placemark) => {
      const coords = placemark?.LineString?.coordinates || placemark?.Point?.coordinates || placemark?.Polygon?.outerBoundaryIs?.LinearRing?.coordinates;
      
      if (coords) {
        const coordArr = coords.trim().split(" ").map((coord) => {
          const [lon, lat] = coord.split(",").map(parseFloat);
          return { lat, lon };
        });

        const filteredCoordArray = coordArr.filter(coord => coord.lat && coord.lon)
        coordinates.push(...filteredCoordArray);
        elements.push(placemark);
      }
    });
    return { coordinates, elements };
  };

  const generateSummary = (kml) => {
    const elementCount = {
      Point: 0,
      LineString: 0,
      Polygon: 0,
      MultiLineString: 0,
    };
    const placemarks = kml.kml.Document.Placemark;
    placemarks.forEach((placemark) => {
      if (placemark?.Point) elementCount.Point++;
      if (placemark?.LineString) elementCount.LineString++;
      if (placemark?.Polygon) elementCount.Polygon++;
      if (placemark?.MultiLineString) elementCount.MultiLineString++;
    });
    return elementCount;
  };

  const calculateTotalLength = (coordinates) => {
    let totalLength = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const point1 = coordinates[i - 1];
      const point2 = coordinates[i];
      totalLength += getDistance(
        { latitude: point1.lat, longitude: point1.lon },
        { latitude: point2.lat, longitude: point2.lon }
      );
    }
    return totalLength / 1000;
  };

  function renderSummaryTable(){
    setRenderTable(prev => !prev)
  }

  function toggleDetails(){
    setDetails(prev => !prev)
  }

  return (
    <div>
      <h1>Ookul Assignment</h1>
      <p>KML file parser and map viewer</p>
      <div style={{display:'flex', alignItems: 'center', margin:'25px 0'}}>
        <UploadKmlForm addKmlData={addKmlData}/>
        <DetailSummaryBtns 
          renderSummaryTable={renderSummaryTable} 
          renderTable={renderTable}
          toggleDetails={toggleDetails}
          details={details}
        />
      </div>
      
      {
        renderTable && summary ? <SummaryTable summary={summary}/> : null
      }
      {
        details ? <p>{`Total Length of LineStrings: ${length.toFixed(2)} km`}</p> : null
      }
      <MapContainer
        center={[32.232, -234.22]}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <KmlMapContainer mapData={mapData}/>
      </MapContainer>
      
    </div>
  )
}