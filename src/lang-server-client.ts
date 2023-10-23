import * as vscode from 'vscode';
import type { ModuleAPI as OutputChannelModule } from './output-channel';
import type { ModuleAPI as ConfigModule } from './config-reader';
import {
  Executable,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient | null = null;

export async function activate(
  outputChannel: OutputChannelModule,
  configReader: ConfigModule,
) {
  const lsExe = configReader.getExecutablePath();
  const lsDebugExe = configReader.getDebugExecutablePath();

  if (lsExe.none) {
    vscode.window.showInformationMessage(
      'roc-lang: "roc-lang.language-server.exe" is not configured. No language server will be started.',
    );
    return;
  }

  const runExecutable = lsExe.map(
    (command) =>
      ({
        command,
        args: [],
        options: { shell: true },
        transport: TransportKind.stdio,
      }) as Executable,
  ).val;

  const debugExecutable = lsDebugExe
    .map(
      (command) => ({ command, transport: TransportKind.stdio }) as Executable,
    )
    .unwrapOr(runExecutable);

  const serverOptions: ServerOptions = {
    run: runExecutable,
    debug: debugExecutable,
  };

  outputChannel.server.appendLine(`Executable: ${lsExe.toString()}`);
  outputChannel.server.appendLine(`Debug executable: ${lsDebugExe.toString()}`);

  let clientOptions: LanguageClientOptions = {
    documentSelector: [
      {
        language: 'roc',
        scheme: 'file',
      },
    ],
    progressOnInitialization: true,
    outputChannel: outputChannel.server,
  };

  client = new LanguageClient(
    'roc-lang',
    'roc-lang',
    serverOptions,
    clientOptions,
  );

  try {
    await client.start();
    outputChannel.server.appendLine('Roc language server started');
  } catch (e) {
    outputChannel.server.appendLine(`Roc language server failed: ${String(e)}`);
  }
}

export async function deactivate() {
  if (client) {
    await client.stop();
  }
}
