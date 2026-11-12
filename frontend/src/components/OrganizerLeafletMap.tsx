import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PinMapa, TipoPinMapa } from '../types/cjr';

interface OrganizerLeafletMapProps {
  pins: PinMapa[];
  filtroAtivo: 'todos' | TipoPinMapa;
}

const createCustomPinIcon = (tipo: TipoPinMapa) => {
  const colorMap: Record<TipoPinMapa, { bg: string; ring: string; label: string }> = {
    sediador: { bg: '#1D4ED8', ring: '#DBEAFE', label: 'S' },
    escola: { bg: '#7C3AED', ring: '#EDE9FE', label: 'E' },
    fornecedor: { bg: '#DC2626', ring: '#FEE2E2', label: 'F' },
  };

  const { bg, ring, label } = colorMap[tipo];

  return L.divIcon({
    className: 'cjr-leaflet-custom-pin',
    html: `
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 4px;
        transform: rotate(-45deg);
        background: ${bg};
        border: 3px solid #FFFFFF;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.32), 0 0 0 4px ${ring};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: #FFFFFF;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 12px;
        ">${label}</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
};

export const OrganizerLeafletMap: React.FC<OrganizerLeafletMapProps> = ({
  pins,
  filtroAtivo,
}) => {
  const pinsFiltrados =
    filtroAtivo === 'todos'
      ? pins
      : pins.filter((pin) => pin.tipo === filtroAtivo);

  const centerJoinville: [number, number] = [-26.2945, -48.8487];

  return (
    <div className="leaflet-wrapper-box">
      <MapContainer
        center={centerJoinville}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '480px', borderRadius: '14px', border: '1px solid var(--border-hairline)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> • React-Leaflet CJR Joinville'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pinsFiltrados.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={createCustomPinIcon(pin.tipo)}
          >
            <Popup>
              <div style={{ minWidth: '210px', fontFamily: 'Inter, sans-serif' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                    background:
                      pin.tipo === 'sediador'
                        ? '#DBEAFE'
                        : pin.tipo === 'escola'
                        ? '#EDE9FE'
                        : '#FEE2E2',
                    color:
                      pin.tipo === 'sediador'
                        ? '#1E3A8A'
                        : pin.tipo === 'escola'
                        ? '#5B21B6'
                        : '#991B1B',
                  }}
                >
                  {pin.subtitulo}
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '13.5px',
                    color: '#0F172A',
                    marginBottom: '4px',
                  }}
                >
                  {pin.nome}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#334155',
                    marginBottom: '4px',
                  }}
                >
                  {pin.detalhe}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {pin.endereco}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
