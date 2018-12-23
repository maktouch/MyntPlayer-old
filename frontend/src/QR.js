import React, { useState, useMemo } from 'react';
import QRCode from 'qrcode';

export default function QR(props) {
  const [qr, setQr] = useState(null);
  const addUrl = `${document.location.origin}/add/${props.masterId}`;

  useMemo(
    _ => {
      QRCode.toDataURL(addUrl, {
        color: {
          light: '#000000ff',
          dark: '#ffffff',
        },
      }).then(url => {
        setQr(url);
      });
    },
    [props.masterId]
  );

  if (!qr) {
    return null;
  }

  return (
    <a href={addUrl} rel="noopener noreferrer" target="_blank">
      <img src={qr} alt="QR" style={{ width: 140 }} />
    </a>
  );
}
