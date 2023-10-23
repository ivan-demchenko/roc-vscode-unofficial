import * as vscode from 'vscode';

export type ModuleAPI = {
  server: vscode.OutputChannel;
};

export function activate(ctx: vscode.ExtensionContext): ModuleAPI {
  const serverOutputChannel = vscode.window.createOutputChannel(
    'Roc Language Server',
  );

  ctx.subscriptions.push(serverOutputChannel);

  return {
    server: serverOutputChannel,
  };
}
