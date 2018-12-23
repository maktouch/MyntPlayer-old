import search from 'youtube-search';
import get from 'lodash/get';

const key = 'AIzaSyD-uLAztEPTV4swJlCHNXqLiFd-TonmOf0';

export default async function(query, params = {}) {
  const opts = {
    type: 'video',
    maxResults: 10,
    videoEmbeddable: 'true',
    videoCategoryId: '10', // music only!
    key,
    ...params,
  };

  const { results } = await search(query, opts);

  const filtered = results.map(({ id, title, thumbnails, link }) => ({
    id,
    title,
    src: get(thumbnails, 'high.url', get(thumbnails, 'medium.url', get(thumbnails, 'default.url'))),
    link,
    key: id,
  }));

  return filtered;
}
