"use client";
import React, { useRef, useState } from "react";
import { api } from "~/trpc/react";

// Leaflet stuff
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Map } from "leaflet";

interface ClinicFormat {
    id: number;
    name: string;
    address: string;
}

const ClinicSelector: React.FC<{
    setClinic: React.Dispatch<React.SetStateAction<ClinicFormat | null>>;
}> = ({ setClinic }) => {
    const clinics = api.clinic.getClinics.useQuery();
    const [mapRef, setMapRef] = useState<Map | null>(null);

    return (
        <>
            {clinics.isLoading && <p>Loading...</p>}
            {clinics.isSuccess && (
                <div className="flex gap-4 ml-2">
                    <div className="w-80 grid grid-cols-1 grid-flow-row">
                        {clinics.data.map(clinic => (
                            <div
                                key={clinic.id}
                                onClick={() => {
                                    mapRef?.setView([Number(clinic.lat), Number(clinic.long)]);
                                }}
                                className="w-full border border-black"
                            >
                                {clinic.name}
                            </div>
                        ))}
                    </div>
                    <MapContainer
                        ref={(ref) => setMapRef(ref)}
                        center={[53.56667000, -7.766670]}
                        zoom={7}
                        zoomControl={false}
                        scrollWheelZoom={false}
                        markerZoomAnimation={true}
                        dragging={false}
                        className="fixed right-0 w-[calc(100vw-21.5rem)] h-[88vh] flex-grow"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {clinics.data.map((clinic) => (
                            <Marker
                                key={clinic.id}
                                position={[
                                    Number(clinic.lat),
                                    Number(clinic.long),
                                ]}
                            >
                                <Popup className="flex flex-col">
                                    <p>Name: {clinic.name}</p>
                                    <p>Address: {clinic.address}</p>
                                    <button
                                        onClick={() => setClinic(clinic)}
                                        className="rounded-lg bg-blue-400 px-2 py-1 font-bold text-white duration-300 hover:bg-blue-500"
                                    >
                                        Select this clinic
                                    </button>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}
        </>
    );
};

export default ClinicSelector;
