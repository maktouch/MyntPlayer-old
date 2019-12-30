<script>
  import QRCode from 'qrcode-generator';
  export let masterId;

  const addUrl = `${document.location.origin}/add/${masterId}`;

  const qr = QRCode(4, 'L');
  qr.addData(addUrl);
  qr.make();

  const data = qr.createDataURL();
</script>

<style>
  a {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  img {
    width: 100px;
  }
</style>

<a href={addUrl} rel="noopener noreferrer" target="_blank">
  <img src={data} alt="Add Page" />
</a>
