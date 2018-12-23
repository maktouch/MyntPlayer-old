import React, { useState, useMemo } from 'react';
import { Item } from 'semantic-ui-react';
import QRCode from 'qrcode';

export default function QR(props) {
  const [qr, setQr] = useState(null);
  const addUrl = `${document.location.origin}/add/${props.masterId}`;

  useMemo(
    _ => {
      QRCode.toDataURL(addUrl).then(url => {
        setQr(url);
      });

      console.log({ addUrl });
    },
    [props.masterId]
  );

  if (!qr) {
    return null;
  }

  return (
    <a href={addUrl} rel="noopener noreferrer" target="_blank">
      <Item.Group divided>
        <Item>
          <Item.Image size="tiny" src={qr} />

          <Item.Content verticalAlign="middle">Add videos from your phone by scanning this QR Code</Item.Content>
        </Item>
      </Item.Group>
    </a>
  );
}
