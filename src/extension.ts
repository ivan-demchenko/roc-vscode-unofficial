import * as vscode from 'vscode';

import {
  CloseAction,
  ErrorAction,
  Executable,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  Trace,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;
let outputChannel: vscode.OutputChannel;

const CONFIGURATION_HEADER = 'roc-lang';
const CONFIG_OPTION = {
  languageServer: {
    exe: 'language-server.exe',
    debugExe: 'language-server.debug-exe',
  },
} as const;

function getStringConfig(key: string): string | null {
  const lsExe = vscode.workspace
    .getConfiguration(CONFIGURATION_HEADER)
    .get(key);

  if (typeof lsExe !== 'string' || lsExe === '') {
    return null;
  }
  return lsExe;
}

async function maybeStartLanguageClient() {
  const lsExe = getStringConfig(CONFIG_OPTION.languageServer.exe);
  const lsDebugExe = getStringConfig(CONFIG_OPTION.languageServer.debugExe);

  if (!lsExe) {
    vscode.window.showInformationMessage(
      'roc-lang: "roc-lang.language-server.exe" is not configured. No language server will be started.',
    );
    return;
  }

  const runLs: Executable = {
    command: '/Users/hafiz/Code/Roc/roc/crates/lang_srv/debug_server.sh',
    args: [],
    options: {
      shell: true,
    },
    transport: TransportKind.stdio,
  };
  let debugLs: Executable;
  if (lsDebugExe) {
    debugLs = {
      command: lsDebugExe,
      transport: TransportKind.stdio,
    };
  } else {
    debugLs = runLs;
  }
  const serverOptions = {
    run: runLs,
    debug: debugLs,
  };

  outputChannel = vscode.window.createOutputChannel('Roc language server');

  let clientOptions: LanguageClientOptions = {
    documentSelector: [
      {
        language: 'roc',
        scheme: 'file',
      },
    ],
    progressOnInitialization: true,
    outputChannel,
  };

  client = new LanguageClient(
    'roc-lang',
    'roc-lang',
    serverOptions,
    clientOptions,
  );

  await client.start();

  outputChannel.appendLine('Roc language server started');
}

export async function activate(context: vscode.ExtensionContext) {
  await maybeStartLanguageClient();

  console.log('The extension "roc-lang-unofficial" is now active!');
}

export async function deactivate(): Promise<void> {
  if (client) {
    await client.stop();
  }
  if (outputChannel) {
    outputChannel.dispose();
  }
}
