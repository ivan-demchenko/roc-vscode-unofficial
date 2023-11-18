import * as vscode from 'vscode';
import { Option, Some, None } from 'ts-results';

const CONFIGURATION_HEADER = 'roc-lang';
const CONFIG_OPTION = {
  languageServer: {
    exe: 'language-server.exe',
    debugExe: 'language-server.debug-exe',
  },
} as const;

function convertUnknownToString(val: unknown): Option<string> {
  if (typeof val !== 'string' || val === '') {
    return None;
  }
  return Some(val);
}

function getStringConfig(key: string): Option<string> {
  const lsExe = vscode.workspace
    .getConfiguration(CONFIGURATION_HEADER)
    .get(key);

  return convertUnknownToString(lsExe);
}

function getEnvVar(key: string): Option<string> {
  const val = process.env[key];
  return convertUnknownToString(val);
}

function optionOr<T>(opt: Option<T>, fallback: Option<T>): Option<T> {
  if (opt.some) {
    return opt;
  }

  return fallback;
}

export type ModuleAPI = {
  getExecutablePath(): Option<string>;
  getDebugExecutablePath(): Option<string>;
};

export function activate(): ModuleAPI {
  return {
    getExecutablePath: () => {
      return optionOr(
        getStringConfig(CONFIG_OPTION.languageServer.exe),
        getEnvVar('ROC_LSP_PATH'),
      );
    },
    getDebugExecutablePath: () => {
      return optionOr(
        getStringConfig(CONFIG_OPTION.languageServer.debugExe),
        getEnvVar('ROC_LSP_DEBUG_PATH'),
      );
    },
  };
}
