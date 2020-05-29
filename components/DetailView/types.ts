interface HistoryDTO {
  'base64': string;
  'createAt': string;
  'fileName'?: string;
  'fullName'?: string;
  'fileType'?: string;
}

interface FileAttachmentDTO {
  'value': [FileKeyDTO];
}

interface FileKeyDTO {
  'fileKey': string;
  'name'?: string;
}

interface RestoreDTO {
  'fcFileAttachment': FileAttachmentDTO;
  'fcHistoryImages': {'value': string};
}

export {HistoryDTO, FileAttachmentDTO, FileKeyDTO, RestoreDTO};