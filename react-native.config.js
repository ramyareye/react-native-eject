module.exports = {
  commands: [
    {
      name: 'eject',
      description: 'Re-create the iOS and Android folders and native code',
      func: () => require('./dist/eject.js'),
    },
  ],
};
