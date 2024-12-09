/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// recovered from https://github.com/react-native-community/cli/pull/275

import path from 'path';
import fs from 'fs';
import semver from 'semver';
import { logger } from '@react-native-community/cli-tools';

import copyProjectTemplateAndReplace from './copyProjectTemplateAndReplace';

/**
 * The eject command re-creates the `android` and `ios` native folders. Because native code can be
 * difficult to maintain, this new script allows an `app.json` to be defined for the project, which
 * is used to configure the native app.
 *
 * The `app.json` config may contain the following keys:
 *
 * - `name` - The short name used for the project, should be TitleCase
 * - `displayName` - The app's name on the home screen
 */

const pkgJson = require(path.resolve('package.json'));
const version = pkgJson.dependencies['react-native'];

function eject() {
  // From RN 0.75, react-native team have moved template to
  // https://github.com/react-native-community/template
  const is75OrAbove = semver.lt('0.75.0', semver.coerce(version)!);

  if (is75OrAbove) {
    const doesTemplateExist = fs.existsSync(
      path.resolve('node_modules/@react-native-community/template'),
    );

    if (!doesTemplateExist) {
      logger.error(
        'You need to install `@react-native-community/template@' + version + '` before ejecting.',
      );
      process.exit(1);
    }

    const templateVersion = semver.coerce(
      pkgJson.dependencies['@react-native-community/template'] ?? pkgJson.devDependencies['@react-native-community/template'],
    )!;

    if (!semver.eq(version, templateVersion)) {
      logger.error(
        'Version mismatch detected! Your `react-native` version is ' +
          version +
          ', while your `@react-native-community/template` version is ' +
          templateVersion +
          '. Please install `@react-native-community/template@' +
          version +
          '` to ensure compatibility.',
      );
      process.exit(1);
    }
  }

  const doesIOSExist = fs.existsSync(path.resolve('ios'));
  const doesAndroidExist = fs.existsSync(path.resolve('android'));
  if (doesIOSExist && doesAndroidExist) {
    logger.error(
      'Both the iOS and Android folders already exist! Please delete `ios` and/or `android` ' +
        'before ejecting.',
    );
    process.exit(1);
  }

  let appConfig = null;
  try {
    appConfig = require(path.resolve('app.json'));
  } catch {
    logger.error(
      'Eject requires an `app.json` config file to be located at ' +
        `${path.resolve('app.json')}, and it must at least specify a \`name\` for the project ` +
        "name, and a `displayName` for the app's home screen label.",
    );
    process.exit(1);
  }

  const appName = appConfig.name;
  if (!appName) {
    logger.error(
      'App `name` must be defined in the `app.json` config file to define the project name. ' +
        'It must not contain any spaces or dashes.',
    );
    process.exit(1);
  }

  const displayName = appConfig.displayName;
  if (!displayName) {
    logger.error(
      'App `displayName` must be defined in the `app.json` config file, to define the label ' +
        'of the app on the home screen.',
    );
    process.exit(1);
  }

  const templateOptions = { displayName };

  if (!doesIOSExist) {
    logger.info('Generating the iOS folder.');
    copyProjectTemplateAndReplace(
      path.resolve(
        'node_modules',
        is75OrAbove ? '@react-native-community/template' : 'react-native',
        'template',
        'ios',
      ),
      path.resolve('ios'),
      appName,
      templateOptions,
    );
  }

  if (!doesAndroidExist) {
    logger.info('Generating the Android folder.');
    copyProjectTemplateAndReplace(
      path.resolve(
        'node_modules',
        is75OrAbove ? '@react-native-community/template' : 'react-native',
        'template',
        'android',
      ),
      path.resolve('android'),
      appName,
      templateOptions,
    );
  }
}

export default {
  name: 'eject',
  description: 'Re-create the iOS and Android folders and native code',
  func: eject(),
  options: [],
};
