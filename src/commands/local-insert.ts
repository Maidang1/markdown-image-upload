import * as vscode from 'vscode';
import { insertImageLocal } from '../utils';
const imageInsert = async () => {
  const { window } = vscode;
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const res = await window.showOpenDialog({
    title: '选择图片',
    filters: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Images: ['png', 'jpg', 'gif', 'svg', 'jpeg'],
    },
  });
  const file = res && res[0];
  if (!file) {
    return;
  }
  const { scheme, path } = file;
  if (scheme !== 'file') {
    return;
  }
  insertImageLocal(path, editor);
};

export const markdownImageInsertCommand = (
  _context: vscode.ExtensionContext
) => {
  return ['markdown-local-insert', imageInsert] as const;
};
