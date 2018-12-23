const compose = {
  ingress: {
    image: 'nginx:1.14.0-alpine',
    ports: ['80:80', '443:443'],
    volumes: [],
    extra_hosts: [],
    links: [],
  },
};

module.exports = {
  compose: function({ services, service, environment, dockerhost }) {
    const hostIp = dockerhost.address;
    const devBoxIp = '192.168.11.10';

    const env = e => e === environment;
    const enabled = name => services.indexOf(name) > -1;
    const nginx = (p, p2) => `./.devctl/ingress/volumes/${p}:/etc/nginx/conf.d/${p2 ? p2 : p}`;

    // prettier-ignore
    const extra_hosts = [
      `dockerhost:${hostIp}`,
      `frontend:${hostIp}`,
      `backend:${hostIp}`,
      // enabled('auth')     ? `auth:${hostIp}`    : `auth:${devBoxIp}`,
    ].filter(i => i);

    // prettier-ignore
    const links = [].filter(i => i);

    // prettier-ignore
    const volumes = [
      './.devctl/ingress/volumes/ssl/myntplayer.local:/etc/ssl/myntplayer.local',
      nginx('default.conf'),
      nginx('main.conf'),
      // enabled('auth') && nginx('auth.conf'),
    ].filter(i => i);

    return {
      ...compose,
      ingress: {
        ...compose.ingress,
        extra_hosts,
        links,
        volumes,
      },
    };
  },
};
