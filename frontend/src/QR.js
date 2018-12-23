import React, { useState, useMemo } from 'react';
import { Item } from 'semantic-ui-react';
import QRCode from 'qrcode';

export default function QR(props) {
  const [qr, setQr] = useState(null);

  const addUrl = `${document.location.origin}/add`;

  useMemo(
    _ => {
      QRCode.toDataURL(addUrl).then(url => {
        setQr(url);
      });
    },
    [addUrl]
  );

  if (!qr) {
    return null;
  }

  return (
    <Item.Group divided>
      <Item>
        <Item.Image size="tiny" src={qr} />
        <Item.Content verticalAlign="middle">Add videos from your phone by scanning this QR Code</Item.Content>
      </Item>
    </Item.Group>
  );
}
