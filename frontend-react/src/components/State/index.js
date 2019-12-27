import React, { useCallback, useReducer, createContext, useContext, useEffect, useRef } from 'react';
import uniqBy from 'lodash/uniqBy';
import Youtube from '../Search/youtube';
import WS from './WS';

const initialState = [];

function reducer(state, action) {
  const { type, ...payload } = action;
  switch (type) {
    case 'add': {
      return uniqBy([...state, payload.video], 'id');
    }
    case 'add-batch': {
      return uniqBy([...state, ...payload.videos], 'id');
    }
    case 'on-end': {
      const copy = [...state];
      copy.splice(0, 1);
      return copy;
    }
    case 'play-next': {
      const copy = [...state];
      const spliced = copy.splice(action.index, 1);
      const current = copy.splice(0, 1);
      return [...current, ...spliced, ...copy];
    }
    case 'remove': {
      return [...state.filter(({ id }) => id !== action.id)];
    }
    case 'set-state': {
      return action.state;
    }
    default:
      throw new Error('Reducer type not found');
  }
}

export const StateContext = createContext({});
export const useStateContext = () => useContext(StateContext);

export default function StateProvider(props) {
  const lastVideo = useRef(null);
  const { masterId, slave = false, debug = false } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Generate more videos related to the last video
   */
  const generateMoreVideos = useCallback(
    async function() {
      if (!lastVideo.current) {
        return;
      }

      const results = await Youtube('', { relatedToVideoId: lastVideo.current.id, maxResults: 5 });
      const videos = results.filter(video => video.id !== lastVideo.current.id);
      dispatch({ type: 'add-batch', videos });
      WS.emit(`add-batch`, { videos, masterId });
    },
    [masterId]
  );

  useEffect(
    function() {
      // don't do any sync if it's a slave
      const [last] = [...state].reverse();

      if (last) {
        lastVideo.current = last;
      }

      if (slave) {
        return;
      }

      if (state.length === 0) {
        generateMoreVideos();
      }

      WS.emit(`sync`, { state, masterId });
    },
    [masterId, state, slave, generateMoreVideos]
  );

  /**
   * Add video to queue (append)
   */
  const addToQueue = useCallback(
    async function(video) {
      dispatch({ type: 'add', video });
      WS.emit(`add`, { video, masterId });
    },
    [masterId]
  );

  /**
   * Remove video from queue, based on index
   */
  const removeFromQueue = useCallback(
    async function(id) {
      dispatch({ type: 'remove', id });
      WS.emit(`remove`, { id, masterId });
    },
    [masterId, dispatch]
  );

  /**
   * Move the video to second place, so that it is played next
   */
  const playNext = useCallback(
    async function(index) {
      dispatch({ type: 'play-next', index });
    },
    [dispatch]
  );

  /**
   * When video ends, pop it from the queue
   */
  const onVideoEnd = useCallback(
    function() {
      dispatch({ type: 'on-end' });
    },
    [dispatch]
  );

  /**
   * Websocket stuff
   */
  useEffect(
    function() {
      // set it in the url
      window.history.replaceState({}, document.title, `${window.document.location.pathname}?masterId=${masterId}`);
      if (slave) {
        WS.emit('state-request', { masterId });
      }
    },
    [slave, masterId]
  );

  useEffect(
    _ => {
      if (slave) {
        WS.on(`${masterId}:sync`, function({ state = [] }) {
          dispatch({ type: 'set-state', state });
        });
      } else {
        WS.on(`${masterId}:state-request`, function() {
          WS.emit(`sync`, { state, masterId });
        });

        WS.on(`${masterId}:add-batch`, function({ videos }) {
          dispatch({ type: 'add-batch', videos });
        });

        WS.on(`${masterId}:add`, function({ video }) {
          dispatch({ type: 'add', video });
        });

        WS.on(`${masterId}:remove`, function({ id }) {
          dispatch({ type: 'remove', id });
        });
      }

      return _ => {
        WS.off(`${masterId}:add-batch`);
        WS.off(`${masterId}:add`);
        WS.off(`${masterId}:play-next`);
        WS.off(`${masterId}:remove`);
        WS.off(`${masterId}:state-request`);
        WS.off(`${masterId}:sync`);
      };
    },
    [masterId, addToQueue, slave, state]
  );

  return (
    <StateContext.Provider
      value={{ queue: state, dispatch, addToQueue, playNext, removeFromQueue, onVideoEnd, generateMoreVideos, debug }}
    >
      {props.children}
    </StateContext.Provider>
  );
}
