import * as vscode from 'vscode';
import * as OutputChannelModule from './output-channel';
import * as LanguageClientModule from './lang-server-client';
import * as ConfigReaderModule from './config-reader';

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = OutputChannelModule.activate(context);

  const langClientApi = LanguageClientModule.activate(
    outputChannel,
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

  outputChannel.server.append('You are ready to Roc!');
}

export function deactivate() {
  LanguageClientModule.deactivate();
}
