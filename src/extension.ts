import * as vscode from 'vscode';
import { uploadImageCommand } from '././commands/upload-image';
import { markdownSettingCommand } from './commands/markdown-settings';

export function activate(context: vscode.ExtensionContext) {
  const { command: uploadImageCommandName, cb: uploadImageCb } =
    uploadImageCommand;
  const { command: markdownSettingCommandName, cb: markdownSettingCb } =
    markdownSettingCommand(context);
  const uploadImage = vscode.commands.registerCommand(
    uploadImageCommandName,
    uploadImageCb
  );
  const markdownSettings = vscode.commands.registerCommand(
    markdownSettingCommandName,
    markdownSettingCb
  );
  const testCommand = vscode.commands.registerCommand('test', () => {
    vscode.window.showInformationMessage('this is a test');
  });
  context.subscriptions.push(uploadImage);
  context.subscriptions.push(markdownSettings);
  context.subscriptions.push(testCommand);
  // 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
}

export function deactivate() {}
