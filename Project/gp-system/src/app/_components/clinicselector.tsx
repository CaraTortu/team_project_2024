"use client";
import React from "react";
import { api } from "~/trpc/react";

// Leaflet stuff
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface ClinicFormat {
    id: number;
    name: string;
    address: string;
}

const ClinicSelector: React.FC<{
    setClinic: React.Dispatch<React.SetStateAction<ClinicFormat | null>>;
}> = ({ setClinic }) => {
    const clinics = api.clinic.getClinics.useQuery();

    return (
        <>
            {clinics.isLoading && <p>Loading...</p>}
            {clinics.isSuccess && (
                <MapContainer
                    center={[
                        Number(clinics.data[0]?.lat),
                        Number(clinics.data[0]?.long),
                    ]}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="relative h-[88vh] w-full"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {clinics.data.map((clinic) => (
                        <Marker
                            position={[Number(clinic.lat), Number(clinic.long)]}
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
            )}
        </>
    );
};

export default ClinicSelector;
