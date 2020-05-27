interface GalleryDTO {
  'file'?: File;
  'fcFileName': {'value': string};
  'fcHistoryImages'?: {
    'value': [HistoryImageDTO] | string;
  };
}
interface RecordDTO {
  'Record_number'?: {'value': number};
  'Created_datetime'?: {'value': string};
  'fcFileName': {'value': string};
  'fcFileAttachment': {'value': [{'fileKey': string}]};
  'fcHistoryImages': {'value': string};
}

interface HistoryImageDTO {
  'fileName': string;
  'fullName': string;
  'fileType': string;
  'createAt': string;
  'base64': any;
}

export {GalleryDTO, RecordDTO, HistoryImageDTO};