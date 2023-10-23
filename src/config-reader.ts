import * as vscode from 'vscode';
import { Option, Some, None } from 'ts-results';

const CONFIGURATION_HEADER = 'roc-lang';
const CONFIG_OPTION = {
  languageServer: {
    exe: 'language-server.exe',
    debugExe: 'language-server.debug-exe',
  },
} as const;

function getStringConfig(key: string): Option<string> {
  const lsExe = vscode.workspace
    .getConfiguration(CONFIGURATION_HEADER)
    .get(key);

  if (typeof lsExe !== 'string' || lsExe === '') {
    return None;
  }
  return Some(lsExe);
}

export type ModuleAPI = {
  getExecutablePath(): Option<string>;
  getDebugExecutablePath(): Option<string>;
};

export function activate(): ModuleAPI {
  return {
    getExecutablePath: () => {
      return getStringConfig(CONFIG_OPTION.languageServer.exe);
    },
    getDebugExecutablePath: () => {
      return getStringConfig(CONFIG_OPTION.languageServer.debugExe);
    },
  };
}
