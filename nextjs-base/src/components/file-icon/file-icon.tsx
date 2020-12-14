import React, { memo } from 'react';

import './file-icon.less';

import ImageDoc from './img/doc.png';
import ImageJpg from './img/jpg.png';
import ImagePdf from './img/pdf.png';
import ImagePng from './img/png.png';
import ImagePpt from './img/ppt.png';
import ImageUnknown from './img/unknown.png';
import ImageXls from './img/xls.png';

export type FileType = keyof typeof ImageIconMap;

interface FileIconProps {
  fileType: FileType;
}

/** 图片集合 */
export const ImageIconMap = {
  doc: ImageDoc,
  docx: ImageDoc,
  jpg: ImageJpg,
  jpge: ImageJpg,
  pdf: ImagePdf,
  png: ImagePng,
  ppt: ImagePpt,
  pptx: ImagePpt,
  unknown: ImageUnknown,
  xls: ImageXls,
  xlsx: ImageXls,
};

/**
 * 文件图标
 */
const FileIcon: React.FC<FileIconProps> = ({ fileType = 'unknown' }) => {
  const img = ImageIconMap[fileType] || ImageIconMap.unknown;

  return <div className="c-file-icon" style={{ backgroundImage: `url(${img})` }} />;
};

export default memo(FileIcon);
