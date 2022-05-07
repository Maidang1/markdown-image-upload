import * as vscode from 'vscode';

const commonValidate = (value: string) => {
  if (!value || value.trim() === '') {
    return '';
  }
};
export const markdownSettingCommand = (context: vscode.ExtensionContext) => {
  return [
    'markdown-setting',
    async () => {
      let username = await vscode.window.showInputBox({
        placeHolder: '请输入你的github用户名',
        validateInput: commonValidate,
      });
      let repo = await vscode.window.showInputBox({
        placeHolder: '请输入你的github仓库名',
        validateInput: commonValidate,
      });
      let token = await vscode.window.showInputBox({
        placeHolder: '请输入你的github token',
        validateInput: commonValidate,
      });

      if (username && repo && token) {
        try {
          await Promise.all([
            context.globalState.update('username', username),
            context.globalState.update('repo', repo),
            context.globalState.update('token', token),
          ]);
        } catch (e) {
          vscode.window.showInformationMessage('设置失败');
          return;
        }

        // 读取数据
        username = context.globalState.get('username');
        repo = context.globalState.get('repo');
        token = context.globalState.get('token');
        vscode.window.showInformationMessage(
          `设置成功，用户名：${username}，仓库名：${repo}，token：${token}`
        );
      }
    },
  ] as const;
};
