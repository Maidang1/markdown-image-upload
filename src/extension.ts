import * as glob from 'glob';
import * as vscode from 'vscode';
import { uploadImageCommand } from '././commands/upload-image';
import { markdownImagePreviewCommand } from './commands/image-preview';
import { markdownSettingCommand } from './commands/markdown-settings';

function getWebviewContent() {
  return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Cat Coding</title>
          </head>
          <body>
              <div id="root">0</div>
              <div id=btn>开始</div>

              <script>
                  (function() {}())
              </script>
          </body>
          </html>
      `;
}

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

  context.subscriptions.push(
    vscode.commands.registerCommand('test', () => {
      const panel = vscode.window.createWebviewPanel(
        'catCoding',
        'Cat Coding',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getWebviewContent();

      // 处理webview中的信息
      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case 'alert':
              vscode.window.showErrorMessage(message.text);
              return;
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );
  context.subscriptions.push(uploadImage);
  context.subscriptions.push(markdownSettings);
  context.subscriptions.push(markdownImagePreview);
  // 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
  // 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
}

export function deactivate() {}
