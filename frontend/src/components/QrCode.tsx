import React, { useMemo } from 'react';
import qrcode from 'qrcode-generator';

/** QR Code real, gerado a partir do código do ingresso (pode ser lido por qualquer leitor). */
export const QrCode: React.FC<{ valor: string; rotulo: string }> = ({ valor, rotulo }) => {
  const { caminho, modulos } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(valor);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let linha = 0; linha < n; linha++) {
      for (let coluna = 0; coluna < n; coluna++) {
        if (qr.isDark(linha, coluna)) d += `M${coluna} ${linha}h1v1h-1z`;
      }
    }
    return { caminho: d, modulos: n };
  }, [valor]);

  const margem = 3;
  const lado = modulos + margem * 2;

  return (
    <svg
      className="qr"
      viewBox={`${-margem} ${-margem} ${lado} ${lado}`}
      role="img"
      aria-label={rotulo}
      shapeRendering="crispEdges"
    >
      <rect x={-margem} y={-margem} width={lado} height={lado} fill="#ffffff" />
      <path d={caminho} fill="#03072e" />
    </svg>
  );
};
