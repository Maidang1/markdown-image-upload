import * as glob from 'glob';
import * as vscode from 'vscode';
import { uploadImageCommand } from '././commands/upload-image';
import { markdownSettingCommand } from './commands/markdown-settings';

export function activate(context: vscode.ExtensionContext) {
  const uploadImage = vscode.commands.registerCommand(
    ...markdownSettingCommand(context)
  );
  const markdownSettings = vscode.commands.registerCommand(
    ...uploadImageCommand(context)
  );
  const testCommand = vscode.commands.registerCommand('test', () => {
    vscode.window.showInformationMessage('this is a test');
  });
  context.subscriptions.push(uploadImage);
  context.subscriptions.push(markdownSettings);
  context.subscriptions.push(testCommand);
  // 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
  // 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
}

export function deactivate() {}
