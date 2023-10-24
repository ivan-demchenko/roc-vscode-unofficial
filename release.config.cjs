/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        tarballDir: false,
      },
    ],
    [
      'semantic-release-vsce',
      {
        packageVsix: true,
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: '*.vsix',
          },
        ],
      },
    ],
  ],
};
