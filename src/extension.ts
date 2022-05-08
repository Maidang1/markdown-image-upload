import * as glob from 'glob';
import * as vscode from 'vscode';
import { uploadImageCommand } from '././commands/upload-image';
import { markdownImagePreviewCommand } from './commands/image-preview';
import { markdownSettingCommand } from './commands/markdown-settings';

export function activate(context: vscode.ExtensionContext) {
  const uploadImage = vscode.commands.registerCommand(
    ...markdownSettingCommand(context)
  );
  const markdownSettings = vscode.commands.registerCommand(
    ...uploadImageCommand(context)
  );

  const markdownImagePreview = vscode.commands.registerCommand(
    ...markdownImagePreviewCommand(context)
  );

  context.subscriptions.push(uploadImage);
  context.subscriptions.push(markdownSettings);
  context.subscriptions.push(markdownImagePreview);
 
}

export function deactivate() {}
