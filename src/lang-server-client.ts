import * as vscode from 'vscode';
import { type Result, Ok, Err, type Option, None } from 'ts-results';
import type { ModuleAPI as OutputChannelModule } from './output-channel';
import type { ModuleAPI as ConfigModule } from './config-reader';
import {
  Executable,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let maybeClient: Option<LanguageClient> = None;

export type ModuleAPI = {
  start(onStarted: () => void, onError: (e: unknown) => void): void;
  stop(onStopped: () => void, onError: (e: unknown) => void): void;
};

type ExecutablePathsTuple = {
  lsExe: Option<string>;
  lsDebugExe: Option<string>;
};

function getExecutablePaths(configReader: ConfigModule): ExecutablePathsTuple {
  return {
    lsExe: configReader.getExecutablePath(),
    lsDebugExe: configReader.getDebugExecutablePath(),
  };
}

function getServerOptions(
  executablePaths: ExecutablePathsTuple,
): Result<ServerOptions, string> {
  const { lsExe, lsDebugExe } = executablePaths;
  if (lsExe.none) {
    return Err(
      'roc-lang: "roc-lang.language-server.exe" is not configured. No language server will be started.',
    );
  }

  const runExecutable = lsExe.map(
    (command): Executable => ({
      command,
      args: [],
      options: { shell: true },
      transport: TransportKind.stdio,
    }),
  ).val;

  const debugExecutable = lsDebugExe
    .map((command): Executable => ({ command, transport: TransportKind.stdio }))
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
  const paths = getExecutablePaths(configReader);

  outputChannel.server.appendLine(
    `LS executable path: ${paths.lsExe.toString()}`,
  );
  outputChannel.server.appendLine(
    `LS debug executable path: ${paths.lsDebugExe.toString()}`,
  );

  const clientResult = getServerOptions(paths).andThen((serverOptions) => {
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
