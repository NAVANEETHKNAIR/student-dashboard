import store from 'store';

export function tutorialIsFinished() {
  return store.get('sd.tutorialFinished') === '1';
}

export function setTutorialAsFinished() {
  store.set('sd.tutorialFinished', '1');
}
