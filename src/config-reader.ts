import { None, Option, Some } from 'ts-results';
import * as vscode from 'vscode';

const CONFIGURATION_HEADER = 'roc-lang';
const CONFIG_OPTION = {
  languageServer: {
    exe: 'language-server.exe',
    args: 'language-server.args',
    debugExe: 'language-server.debug-exe',
    debugArgs: 'language-server.debug-args',
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

function getArrayConfig(key: string): string[] {
  const val = vscode.workspace.getConfiguration(CONFIGURATION_HEADER).get(key);

  if (Array.isArray(val)) {
    return val.filter((item): item is string => typeof item === 'string');
  }
  return [];
}

function optionOr<T>(opt: Option<T>, fallback: Option<T>): Option<T> {
  if (opt.some) {
    return opt;
  }

  return fallback;
}

export type ModuleAPI = {
  getExecutablePath(): Option<string>;
  getExecutableArgs(): string[];
  getDebugExecutablePath(): Option<string>;
  getDebugExecutableArgs(): string[];
};

export function activate(): ModuleAPI {
  return {
    getExecutablePath: () => {
      return optionOr(
        getStringConfig(CONFIG_OPTION.languageServer.exe),
        getEnvVar('ROC_LSP_PATH'),
      );
    },
    getExecutableArgs: () => {
      return getArrayConfig(CONFIG_OPTION.languageServer.args);
    },
    getDebugExecutablePath: () => {
      return optionOr(
        getStringConfig(CONFIG_OPTION.languageServer.debugExe),
        getEnvVar('ROC_LSP_DEBUG_PATH'),
      );
    },
    getDebugExecutableArgs: () => {
      return getArrayConfig(CONFIG_OPTION.languageServer.debugArgs);
    },
  };
}
