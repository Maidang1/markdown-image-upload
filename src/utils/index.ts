import { readFile } from 'fs/promises';
export function checkIsImg(url: string) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
}

export const imagePathToBase64 = async (path: string) => {
  try {
    const content = await readFile(path.trim(), 'base64');
    return content;
  } catch (e) {
    return null;
  }
};

/** 根据时间戳生成文件名 */
export const getFileName = (file: string) => {
  const time = new Date().valueOf();
  const fileName = file.split('.');

  const ext = fileName.pop();

  return time + '.' + ext;
};
