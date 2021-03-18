import type { IncomingMessage } from 'http';

/**
 * 获取文件扩展名
 * @param {string} filename 文件名称
 *
 * @description
 * console.log(getFileExtension(''));                            // ''
 * console.log(getFileExtension('filename'));                    // ''
 * console.log(getFileExtension('filename.txt'));                // 'txt'
 * console.log(getFileExtension('.hiddenfile'));                 // ''
 * console.log(getFileExtension('filename.with.many.dots.ext')); // 'ext'
 */
export const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * 是否是异端
 * @param req http request 对象
 */
export const isMobile = (req: IncomingMessage | undefined) => {
  if (req) {
    const deviceAgent = req.headers['user-agent'] || '';
    return /Android|webOS|iPhone|iPod|BlackBerry/i.test(deviceAgent);
  }
  return false;
};

/**
 * html 转纯文字
 * @param html html 代码
 */
export const html2text = (html: string) => html.replace(/<[^>]+>/g, '');

/**
 * 获取一段文字的前 n 个字
 * @param text 文本
 * @param num 个数
 */
export const getDescription = (text: string, num = 120) =>
  html2text(text).replace(/\s/g, '').slice(0, num);
