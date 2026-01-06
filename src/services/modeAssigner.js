const { Settings } = require('../models/Settings');

async function assignModeForNewUser() {
  const settings = await Settings.findById('ctc-settings').lean();

  if (!settings) return 'vanilla';

  const strategy = settings.assignmentStrategy;

  if (strategy === 'fixed') {
    return settings.fixedMode || 'vanilla';
  }

  if (strategy === 'random') {
    return Math.random() < 0.5 ? 'vanilla' : 'narrative';
  }

  if (strategy === 'iterative') {
    const updated = await Settings.findOneAndUpdate(
      { _id: 'ctc-settings' },
      { $inc: { iterativeIndex: 1 } },
      { new: true },
    ).lean();
    const modes =
      Array.isArray(updated.iterativeModes) && updated.iterativeModes.length > 0
        ? updated.iterativeModes
        : ['narrative', 'vanilla'];
    const idx = (updated.iterativeIndex - 1) % modes.length;
    return modes[idx];
  }

  return 'vanilla';
}

module.exports = { assignModeForNewUser };
