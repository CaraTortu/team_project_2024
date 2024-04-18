"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";

// Leaflet stuff
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { type LatLngExpression, type Map } from "leaflet";

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

    const centerIcon = (clinic: any) => {
        const coordinates: LatLngExpression = [
            Number(clinic.latitude),
            Number(clinic.longitude),
        ];
        mapRef?.setView(coordinates, 14);
        mapRef?.eachLayer((L) => {
            const layer_coordinates = L.getPopup()?.getLatLng();
            if (!layer_coordinates) return;

            if (
                layer_coordinates.lat == coordinates[0] &&
                layer_coordinates.lng == coordinates[1]
            ) {
                L.openPopup();
            }
        });
    };

    return (
        <>
            {clinics.isLoading && <p>Loading...</p>}
            {clinics.isSuccess && (
                <div className="ml-2 flex gap-4">
                    <div className="grid w-80 grid-flow-row h-[80vh] grid-cols-1 place-content-center space-y-4 rounded-lg">
                        {clinics.data.map((clinic) => (
                            <div
                                key={clinic.id}
                                className="flex flex-col w-full rounded-lg border-2 border-blue-600 bg-blue-200 px-4 py-2 text-black gap-4"
                            >
                                <p className="font-bold text-lg">{clinic.name} - <span className="italic font-semibold text-gray-500 text-sm">You've been here {clinic.appointments.filter(app => !app.isCancelled).length} times</span></p>
                                <div className="flex-grow gap-2 flex items-end ">
                                    <button role="button" className="px-2 py-1 bg-blue-100 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-xl duration-300" onClick={() => centerIcon(clinic)}>Zoom in</button>
                                    <button role="button" className="px-2 py-1 bg-blue-100 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-xl duration-300" onClick={() => setClinic(clinic)}>Select this clinic</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <MapContainer
                        ref={(ref) => setMapRef(ref)}
                        center={[53.56667, -7.76667]}
                        zoom={7}
                        scrollWheelZoom={false}
                        markerZoomAnimation={true}
                        className="fixed right-2 h-[88vh] w-[calc(100vw-21.5rem)] flex-grow rounded-xl"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {clinics.data.map((clinic) => (
                            <Marker
                                key={clinic.id}
                                position={[
                                    Number(clinic.latitude),
                                    Number(clinic.longitude),
                                ]}
                            >
                                <Popup
                                    className="flex flex-col"
                                    closeButton={false}
                                >
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
