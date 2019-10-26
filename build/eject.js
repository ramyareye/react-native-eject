'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _copyProjectTemplateAndReplace = require('@react-native-community/cli/build/tools/generator/copyProjectTemplateAndReplace');

var _copyProjectTemplateAndReplace2 = _interopRequireDefault(_copyProjectTemplateAndReplace);

var _cliTools = require('@react-native-community/cli-tools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

function eject() {
  var doesIOSExist = _fs2.default.existsSync(_path2.default.resolve('ios'));
  var doesAndroidExist = _fs2.default.existsSync(_path2.default.resolve('android'));
  if (doesIOSExist && doesAndroidExist) {
    _cliTools.logger.error('Both the iOS and Android folders already exist! Please delete `ios` and/or `android` ' + 'before ejecting.');
    process.exit(1);
  }

  var appConfig = null;
  try {
    appConfig = require(_path2.default.resolve('app.json'));
  } catch (e) {
    _cliTools.logger.error('Eject requires an `app.json` config file to be located at ' + (_path2.default.resolve('app.json') + ', and it must at least specify a `name` for the project ') + "name, and a `displayName` for the app's home screen label.");
    process.exit(1);
  }

  var appName = appConfig.name;
  if (!appName) {
    _cliTools.logger.error('App `name` must be defined in the `app.json` config file to define the project name. ' + 'It must not contain any spaces or dashes.');
    process.exit(1);
  }

  var displayName = appConfig.displayName;
  if (!displayName) {
    _cliTools.logger.error('App `displayName` must be defined in the `app.json` config file, to define the label ' + 'of the app on the home screen.');
    process.exit(1);
  }

  var templateOptions = { displayName: displayName };

  if (!doesIOSExist) {
    _cliTools.logger.info('Generating the iOS folder.');
    (0, _copyProjectTemplateAndReplace2.default)(_path2.default.resolve('node_modules', 'react-native', 'template', 'ios'), _path2.default.resolve('ios'), appName, templateOptions);
  }

  if (!doesAndroidExist) {
    _cliTools.logger.info('Generating the Android folder.');
    (0, _copyProjectTemplateAndReplace2.default)(_path2.default.resolve('node_modules', 'react-native', 'template', 'android'), _path2.default.resolve('android'), appName, templateOptions);
  }
}

exports.default = {
  name: 'eject',
  description: 'Re-create the iOS and Android folders and native code',
  func: eject(),
  options: []
};