interface GalleryDTO {
  'file'?: File;
  'fcFileName': {'value': string};
  'fcHistoryImages'?: {
    'value': [{
      fileName: string;
      fullName: string;
      fileType: string;
      createAt: string;
      base64: any;
    }];
  };
}
interface RecordDTO {
  'Record_number'?: {'value': number};
  'Created_datetime'?: {'value': string};
  'fcFileName': {'value': string};
  'fcFileAttachment': {'value': [{'fileKey': string}]};
  'fcHistoryImages': {
    'value': [{
      fileName: string;
      fullName: string;
      fileType: string;
      createAt: string;
      base64: any;
    }];
  };
}
export {GalleryDTO, RecordDTO};