import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QR(props) {
  const { masterId } = props;
  const [qr, setQr] = useState(null);
  const addUrl = `${document.location.origin}/add/${masterId}`;

  useEffect(
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
    [addUrl]
  );

  if (!qr) {
    return null;
  }

  return (
    <a href={addUrl} rel="noopener noreferrer" target="_blank" className={props.className}>
      <img src={qr} alt="QR" style={{ width: 140 }} />
    </a>
  );
}
