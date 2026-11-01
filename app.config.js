// app.config.js - estende o app.json e injeta o hash do commit na versão publicada.
// No EAS Build usa a variável EAS_BUILD_GIT_COMMIT_HASH; localmente usa `git rev-parse HEAD`.
const { execSync } = require('child_process');

function obterCommit() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) return process.env.EAS_BUILD_GIT_COMMIT_HASH;
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    return 'desconhecido';
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra ?? {}),
    commitHash: obterCommit(),
  },
});
