import { Err, None, Ok, type Option, type Result } from 'ts-results';
import * as vscode from 'vscode';
import {
  Executable,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from 'vscode-languageclient/node';
import type { ModuleAPI as ConfigModule } from './config-reader';
import type { ModuleAPI as OutputChannelModule } from './output-channel';

let maybeClient: Option<LanguageClient> = None;

export type ModuleAPI = {
  start(onStarted: () => void, onError: (e: unknown) => void): void;
  stop(onStopped: () => void, onError: (e: unknown) => void): void;
};

type ExecutableConfig = {
  lsExe: Option<string>;
  lsArgs: string[];
  lsDebugExe: Option<string>;
  lsDebugArgs: string[];
};

function getExecutableConfig(configReader: ConfigModule): ExecutableConfig {
  return {
    lsExe: configReader.getExecutablePath(),
    lsArgs: configReader.getExecutableArgs(),
    lsDebugExe: configReader.getDebugExecutablePath(),
    lsDebugArgs: configReader.getDebugExecutableArgs(),
  };
}

function getServerOptions(
  config: ExecutableConfig,
): Result<ServerOptions, string> {
  const { lsExe, lsArgs, lsDebugExe, lsDebugArgs } = config;
  if (lsExe.none) {
    return Err(
      'roc-lang: "roc-lang.language-server.exe" is not configured. No language server will be started.',
    );
  }

  const runExecutable = lsExe.map(
    (command): Executable => ({
      command,
      args: lsArgs,
      options: { shell: true },
    }),
  ).val;

  const debugExecutable = lsDebugExe
    .map(
      (command): Executable => ({
        command,
        args: lsDebugArgs.length > 0 ? lsDebugArgs : lsArgs,
        options: { shell: true },
      }),
    )
    .unwrapOr(runExecutable);

  return new Ok({
    run: runExecutable,
    debug: debugExecutable,
  });
}

function getClientOptions(
  outputChannel: vscode.OutputChannel,
): Result<LanguageClientOptions, string> {
  return new Ok({
    documentSelector: [
      {
        language: 'roc',
        scheme: 'file',
      },
    ],
    progressOnInitialization: true,
    outputChannel: outputChannel,
  });
}

function startClient(onStarted: () => void, onError: (e: unknown) => void) {
  maybeClient.map((client) => {
    client.start().then(onStarted).catch(onError);
  });
}

function stopClient(onStopped: () => void, onError: (e: unknown) => void) {
  maybeClient.map((client) => {
    client.stop().then(onStopped).catch(onError);
  });
}

export function activate(
  outputChannel: OutputChannelModule,
  configReader: ConfigModule,
): ModuleAPI {
  const config = getExecutableConfig(configReader);

  outputChannel.server.appendLine(
    `LS executable path: ${config.lsExe.toString()}`,
  );
  outputChannel.server.appendLine(
    `LS executable args: ${JSON.stringify(config.lsArgs)}`,
  );
  outputChannel.server.appendLine(
    `LS debug executable path: ${config.lsDebugExe.toString()}`,
  );
  outputChannel.server.appendLine(
    `LS debug executable args: ${JSON.stringify(config.lsDebugArgs)}`,
  );

  const clientResult = getServerOptions(config).andThen((serverOptions) => {
    return getClientOptions(outputChannel.server).map((clientOptions) => {
      return new LanguageClient(
        'roc-lang',
        'roc-lang',
        serverOptions,
        clientOptions,
      );
    });
  });

  maybeClient = clientResult.toOption();

  startClient(
    () => outputChannel.server.appendLine('Roc language server started'),
    (e) =>
      outputChannel.server.appendLine(
        `Roc language server failed: ${String(e)}`,
      ),
  );

  return {
    start: startClient,
    stop: stopClient,
  };
}

export async function deactivate() {
  stopClient(
    () => console.log('Language server stopped'),
    (e) => console.error(e),
  );
}
