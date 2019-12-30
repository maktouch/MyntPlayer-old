import { writable } from 'svelte/store';
import uniqBy from 'lodash/uniqBy';
import Youtube from './lib/youtube';

function createQueue() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    reset: () => set([]),
    add: video => update(state => uniqBy([...state, video], 'id')),
    addBatch: videos => update(state => uniqBy([...state, ...videos], 'id')),
    onEnd: () =>
      update(state => {
        const copy = [...state];
        copy.splice(0, 1);
        return copy;
      }),
    playNext: index => {
      update(state => {
        const copy = [...state];
        const spliced = copy.splice(index, 1);
        const current = copy.splice(0, 1);
        return [...current, ...spliced, ...copy];
      });
    },
    remove: idToRemove => update(state => [...state.filter(({ id }) => id !== idToRemove)]),
  };
}

export const queue = createQueue();
