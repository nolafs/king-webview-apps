import { defineMessages } from '../utils/messages';

const kingInteractiveMessages = defineMessages('systemBackButton');

const kingReceiverMessages = defineMessages(
  'mediaStarted',
  'mediaFinished',
  'exit',
  'getCCSInfo',
  'PLAY_HAPTIC',
  'SET_PERSISTED',
  'GET_PERSISTED',
  'SCRIPT_LOADED',
);

const kingSenderMessages = defineMessages('WEB_VIEW_OPENED', 'PLAYER_PROGRESS', 'PING');

const miniGameMessages = defineMessages(
  'WMG_TUTORIAL_DONE',
  'WMG_OPEN_VAULT',
  'WMG_UPDATE_STATE',
  'WMG_FINISH_GAME',
  'WMG_DELIVER_REWARD',
  'WMG_SPEND_TOKENS',
);

const contentHubMessages = defineMessages('SET_SHOW_WIDGET', 'SET_WIDGET_NOTIFICATION');

export const candySenderMessages = defineMessages(
  ...kingInteractiveMessages,
  ...kingReceiverMessages,
  ...miniGameMessages,
  ...contentHubMessages,
  'SEND_TRACKING',
);

export const candyReceiverMessages = defineMessages(
  ...kingInteractiveMessages,
  ...kingSenderMessages,
);