import store from 'store';

export function tutorialIsFinished() {
  return store.get('sd.tutorialFinished') === '1';
}

export function setLastSeenVisualization(visualization) {
  store.set('sd.lastSeenVisualization', visualization);
}

export function getLastSeenVisualization() {
  return store.get('sd.lastSeenVisualization');
}

export function setTutorialAsFinished() {
  store.set('sd.tutorialFinished', '1');
}
