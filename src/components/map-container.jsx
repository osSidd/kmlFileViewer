import { useEffect } from "react";
import { TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";

export default function KmlMapContainer({mapData}){

    const map = useMap()

    useEffect(() => {
      
      const {lat, lon} = mapData?.coordinates?.[0] ?? {lat:37.422, lon:-122.084}
      
      map.flyTo([lat, lon], 13, {duration: 4})

    }, [mapData])
    
    return(
        <>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {mapData?.coordinates?.length > 0 && (
          <Polyline positions={mapData.coordinates} color="blue" />
        )}
        {mapData?.coordinates?.map((point, index) => (
          <Marker position={[point.lat, point.lon]} key={index}>
            <Popup>
              Latitude: {point.lat} <br /> Longitude: {point.lon}
            </Popup>
          </Marker>
        ))}
      </>
    )
}