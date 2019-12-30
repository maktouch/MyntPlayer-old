// import search from 'youtube-search';
import axios from 'axios';
import get from 'lodash/get';
// import config from '../config';
const config = {
  API_KEY: 'AIzaSyD-uLAztEPTV4swJlCHNXqLiFd-TonmOf0',
};

export default async function(q, params = {}) {
  const opts = {
    type: 'video',

    videoEmbeddable: 'true',
    videoCategoryId: '10', // music only!

    ...params,
  };

  const { data } = await axios.request({
    url: 'https://www.googleapis.com/youtube/v3/search',
    params: {
      part: 'snippet',
      maxResults: 10,
      q,
      type: 'video',
      videoCategoryId: '10',
      videoEmbeddable: 'true',
      key: config.API_KEY,
      ...params,
    },
  });

  const results = get(data, 'items', []).map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    src: get(
      item,
      'snippet.thumbnails.high.url',
      get(item, 'snippet.thumbnails.medium.url', get(item, 'snippet.thumbnails.default.url'))
    ),
  }));

  return results;
}
