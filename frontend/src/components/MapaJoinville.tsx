import React, { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { semMovimento } from '../lib/movimento';
import { PinMapa, TipoPinMapa } from '../types/cjr';

export const ROTULO_TIPO: Record<TipoPinMapa, string> = {
  sediador: 'Sediador',
  escola: 'Escola',
  fornecedor: 'Parceiro',
};

/* Três marcadores na mesma família de azul, diferenciados por forma e preenchimento:
   sede = azul cheio com estrela, escola = branco com contorno, fornecedor = azul-escuro com quadrado. */
const GLIFO: Record<TipoPinMapa, string> = {
  sediador: '<path d="M12 6.2l1.7 3.6 3.9.5-2.9 2.7.8 3.9-3.5-2-3.5 2 .8-3.9-2.9-2.7 3.9-.5z" fill="#fff"/>',
  escola: '<circle cx="12" cy="11.5" r="3.6" fill="#0013b0"/>',
  fornecedor: '<rect x="8.6" y="8.1" width="6.8" height="6.8" rx="1.2" fill="#fff"/>',
};

const COR: Record<TipoPinMapa, { fundo: string; borda: string }> = {
  sediador: { fundo: '#0013b0', borda: '#ffffff' },
  escola: { fundo: '#ffffff', borda: '#0013b0' },
  fornecedor: { fundo: '#03072e', borda: '#ffffff' },
};

export const glifoDoTipo = (tipo: TipoPinMapa, tamanho = 24) => {
  const { fundo, borda } = COR[tipo];
  return `<svg width="${tamanho}" height="${(tamanho * 30) / 24}" viewBox="0 0 24 30" aria-hidden="true">
    <path d="M12 28.5c-1.2-3.4-3.3-5.6-5.3-7.9C4.6 18.3 3 15.8 3 12.2 3 7.1 7 3 12 3s9 4.1 9 9.2c0 3.6-1.6 6.1-3.7 8.4-2 2.3-4.1 4.5-5.3 7.9z"
      fill="${fundo}" stroke="${borda}" stroke-width="2" stroke-linejoin="round"/>
    ${GLIFO[tipo]}
  </svg>`;
};

const criarIcone = (tipo: TipoPinMapa, ativo: boolean) =>
  L.divIcon({
    className: `pino ${ativo ? 'pino--ativo' : ''}`,
    html: glifoDoTipo(tipo, 34),
    iconSize: [34, 42],
    iconAnchor: [17, 41],
    popupAnchor: [0, -38],
  });

const CENTRO: [number, number] = [-26.288, -48.855];

const Foco: React.FC<{ pin: PinMapa | null; marcadores: React.MutableRefObject<Record<string, L.Marker>> }> = ({
  pin,
  marcadores,
}) => {
  const mapa = useMap();
  useEffect(() => {
    if (!pin) return;
    const parado = semMovimento();
    mapa.flyTo([pin.lat, pin.lng], 14, { duration: parado ? 0 : 1.1 });
    const abrir = window.setTimeout(() => marcadores.current[pin.id]?.openPopup(), parado ? 0 : 700);
    return () => window.clearTimeout(abrir);
  }, [pin, mapa, marcadores]);
  return null;
};

export const MapaJoinville: React.FC<{
  pins: PinMapa[];
  selecionado: string | null;
  aoSelecionar: (id: string) => void;
}> = ({ pins, selecionado, aoSelecionar }) => {
  const marcadores = useRef<Record<string, L.Marker>>({});
  const pinAtivo = pins.find((p) => p.id === selecionado) ?? null;

  return (
    <MapContainer center={CENTRO} zoom={12} scrollWheelZoom className="mapa" attributionControl>
      {/* Tiles padrão do OpenStreetMap; o CSS (.mapa .leaflet-tile-pane) os deixa em tons de azul. */}
      <TileLayer
        attribution='&copy; colaboradores do <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <Foco pin={pinAtivo} marcadores={marcadores} />
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={criarIcone(pin.tipo, pin.id === selecionado)}
          title={pin.nome}
          ref={(m) => {
            if (m) marcadores.current[pin.id] = m;
            else delete marcadores.current[pin.id];
          }}
          eventHandlers={{ click: () => aoSelecionar(pin.id) }}
        >
          <Popup>
            <div className="pino-balao">
              <span className="pino-balao__papel">{pin.papel}</span>
              <strong>{pin.nome}</strong>
              <p>{pin.detalhe}</p>
              <span className="pino-balao__endereco">{pin.endereco}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
