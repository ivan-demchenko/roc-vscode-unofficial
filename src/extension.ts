import * as vscode from 'vscode';
import * as OutputChannelModule from './output-channel';
import * as LanguageClientModule from './lang-server-client';
import * as ConfigReaderModule from './config-reader';

export async function activate(context: vscode.ExtensionContext) {
  const langClientApi = LanguageClientModule.activate(
    OutputChannelModule.activate(context),
    ConfigReaderModule.activate(),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('roc-lang-unofficial.ls-start', () => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Starting Roc Language Server',
          cancellable: true,
        },
        (_prog, token) => {
          return new Promise<void>((res, rej) => {
            token.onCancellationRequested(rej);
            langClientApi.start(res, rej);
          });
        },
      );
    }),
    vscode.commands.registerCommand('roc-lang-unofficial.ls-stop', () => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Stopping Roc Language Server',
          cancellable: true,
        },
        (_prog, token) => {
          return new Promise<void>((res, rej) => {
            token.onCancellationRequested(rej);
            langClientApi.stop(res, rej);
          });
        },
      );
    }),
  );
}

export async function deactivate(): Promise<void> {
  LanguageClientModule.deactivate();
}
