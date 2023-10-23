import * as vscode from 'vscode';
import * as OutputChannelModule from './output-channel';
import * as LanguageClientModule from './lang-server-client';
import * as ConfigReaderModule from './config-reader';

export async function activate(context: vscode.ExtensionContext) {
  LanguageClientModule.activate(
    OutputChannelModule.activate(context),
    ConfigReaderModule.activate(),
  );
}

export async function deactivate(): Promise<void> {
  LanguageClientModule.deactivate();
}
