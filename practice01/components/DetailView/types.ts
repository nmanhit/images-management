interface HistoryDTO {
  'base64': string;
  'createAt': string;
  'fileName'?: string;
  'fullName'?: string;
  'fileType'?: string;
}

interface FileKeyDTO {
  'fileKey': string;
}

interface RestoreDTO {
  'fcFileAttachment': {'value': [{'fileKey': string}]};
  'fcHistoryImages': {'value': string};
}
export {HistoryDTO, FileKeyDTO, RestoreDTO};