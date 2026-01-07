const { Settings } = require('../models/Settings');

async function bootstrap() {
  await Settings.updateOne(
    { _id: 'ctc-settings' },
    {
      $setOnInsert: {
        _id: 'ctc-settings',
        activeNarrativeConfigId: '',
        fallbackNarrativeConfigId: '',
        assignmentStrategy: 'fixed',
        fixedMode: 'vanilla',
        iterativeModes: ['narrative', 'vanilla'],
        iterativeIndex: 0,
      },
    },
    { upsert: true },
  );
  console.log('Settings bootstrap complete!');
}

module.exports = { bootstrap };
