const { Settings } = require('../models/Settings');

async function bootstrap() {
  await Settings.updateOne(
    { _id: 'ctc-settings' },
    {
      $setOnInsert: {
        _id: 'ctc-settings',
        activeCtcTheme: '00000000-0000-0000-0000-000000000000',
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
