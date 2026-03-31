import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const ecoIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 13);
  }, [position, map]);
  return position ? <Marker position={position}><Popup>Você está aqui</Popup></Marker> : null;
}

function getOccupancyColor(level) {
  if (level < 30) return "bg-primary/10 text-primary";
  if (level < 70) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function MapPage() {
  const [userPosition, setUserPosition] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const { data: ecopoints = [] } = useQuery({
    queryKey: ["ecopoints"],
    queryFn: () => base44.entities.EcoPoint.list("-created_date", 100),
  });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setUserPosition([-23.4977, -46.7520]) // Default: IFSP Pirituba
    );
  }, []);

  const getDistance = (lat, lng) => {
    if (!userPosition) return null;
    const R = 6371;
    const dLat = ((lat - userPosition[0]) * Math.PI) / 180;
    const dLon = ((lng - userPosition[1]) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((userPosition[0] * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-96 border-r overflow-y-auto p-4 space-y-3 bg-card order-2 lg:order-1 max-h-[40vh] lg:max-h-full">
        <div className="mb-4">
          <h1 className="font-space font-bold text-xl mb-1">Ecopontos</h1>
          <p className="text-xs text-muted-foreground">{ecopoints.length} ecopontos encontrados</p>
        </div>
        {ecopoints.map((ep) => {
          const dist = getDistance(ep.latitude, ep.longitude);
          return (
            <Card
              key={ep.id}
              className={`cursor-pointer transition-all hover:border-primary/30 ${selectedPoint?.id === ep.id ? "border-primary" : ""}`}
              onClick={() => setSelectedPoint(ep)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{ep.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {ep.address}
                    </p>
                  </div>
                  {ep.active ? (
                    <Badge className="bg-primary/10 text-primary text-xs">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Inativo</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className={`${getOccupancyColor(ep.occupancy_level || 0)} text-xs`}>
                    {ep.occupancy_level || 0}% ocupado
                  </Badge>
                  {dist && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> {dist} km
                    </span>
                  )}
                </div>
                {selectedPoint?.id === ep.id && (
                  <Button
                    size="sm"
                    className="mt-3 w-full rounded-xl gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${ep.latitude},${ep.longitude}`, "_blank");
                    }}
                  >
                    <Navigation className="w-4 h-4" /> Traçar Rota
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {ecopoints.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">Nenhum ecoponto cadastrado</div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 order-1 lg:order-2 min-h-[40vh] lg:min-h-0">
        <MapContainer
          center={userPosition || [-23.4977, -46.7520]}
          zoom={12}
          className="w-full h-full"
          style={{ minHeight: "300px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={userPosition} />
          {ecopoints.map((ep) => (
            <Marker
              key={ep.id}
              position={[ep.latitude, ep.longitude]}
              icon={ecoIcon}
              eventHandlers={{ click: () => setSelectedPoint(ep) }}
            >
              <Popup>
                <div>
                  <strong>{ep.name}</strong>
                  <br />{ep.address}
                  <br />Ocupação: {ep.occupancy_level || 0}%
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}