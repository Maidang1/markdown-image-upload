import * as vscode from 'vscode';
import * as glob from 'glob';
import { uploadImageCommand } from '././commands/upload-image';
import { markdownImagePreviewCommand } from './commands/image-preview';
import { markdownSettingCommand } from './commands/markdown-settings';
import { markdownImagePasteCommand } from './commands/image-paste';
import { markdownImageInsertCommand } from './commands/local-insert';
import { CodelensProvider } from './providers/CodelensProvider.ts';

export function activate(context: vscode.ExtensionContext) {
  const codelensProvider = new CodelensProvider();
  vscode.languages.registerCodeLensProvider(
    {
      language: 'markdown',
    },
    codelensProvider
  );
  const commands = [
    uploadImageCommand,
    markdownImagePreviewCommand,
    markdownSettingCommand,
    markdownImagePasteCommand,
    markdownImageInsertCommand,
  ];
  commands.forEach((command) => {
    const [name, callback] = command(context);
    context.subscriptions.push(vscode.commands.registerCommand(name, callback));
  });
}

export function deactivate() {}
