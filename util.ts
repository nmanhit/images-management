import {SOMETHING_WENT_WRONG} from './constants/message';
import {RESIZE_IMAGE} from './config';

function timestampToString(timestamp: string | number) {
  if (!timestamp) {
    return '';
  }
  let date = timestamp;
  if (typeof (timestamp) === 'string') {
    date = parseInt(timestamp, 0);
  }
  const current = new Date(date);
  return formatDate(current);
}

function utcToString(utc: string) {
  let current = new Date();
  if (utc) {
    current = new Date(utc);
  }
  return formatDate(current);
}

function formatDate(current: Date) {
  const date: number = current.getDate();
  const month: number = current.getMonth() + 1;
  const year: number = current.getFullYear();
  const hours: number = current.getHours();
  const minutes: number = current.getMinutes();
  const seconds: number = current.getSeconds();

  let strDate: string = date.toString();
  let strMonth: string = month.toString();
  let strHours: string = hours.toString();
  let strMinutes: string = minutes.toString();
  let strSeconds: string = seconds.toString();

  if (date < 10) {
    strDate = `0${date}`;
  }
  if (month < 10) {
    strMonth = `0${month}`;
  }
  if (hours < 10) {
    strHours = `0${hours}`;
  }
  if (minutes < 10) {
    strMinutes = `0${minutes}`;
  }
  if (seconds < 10) {
    strSeconds = `0${seconds}`;
  }
  const fullDate = `${strDate}/${strMonth}/${year}`;
  const fullTime = `${strHours}:${strMinutes}:${strSeconds}`;
  return `${fullDate} ${fullTime}`;
}

function fileToBase64(file: File | Blob) {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
  });
}

function b64toBlob(dataURI: string, contentType: string) {
  if (!dataURI) {
    return null;
  }
  const byteString = atob(dataURI.split(',')[1]);
  const buffer = new ArrayBuffer(byteString.length);
  const uInt8 = new Uint8Array(buffer);
  for (let i = 0; i < byteString.length; i++) {
    uInt8[i] = byteString.charCodeAt(i);
  }
  return new Blob([buffer], {type: contentType});
}

function handleError(error?: string) {
  if (!error) {
    alert(SOMETHING_WENT_WRONG);
  }
  const data = JSON.parse(error);
  if (data?.message) {
    alert(data.message);
  }
}

function resizeImage(source: string) {
  return new Promise((resolve) => {
    if (!source) {
      resolve('');
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = RESIZE_IMAGE.WIDTH;
    canvas.height = RESIZE_IMAGE.HEIGHT;
    const image = new Image();
    image.src = source;
    image.onload = function(e) {
      ctx.drawImage(image,
        0, 0, image.width, image.height,
        0, 0, canvas.width, canvas.height
      );
      resolve(canvas.toDataURL());
    };
  });
}

function humanFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / (Math.pow(1024, i))).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function createElmDownloadFile(blobUrl: string, fileName: string) {
  const root = document.querySelector('.download-attachement');
  if (!root) {
    const divElm = document.createElement('div');
    divElm.classList.add('download-attachement');

    const aElm = document.createElement('a');
    aElm.setAttribute('href', blobUrl);
    aElm.setAttribute('download', fileName);
    divElm.appendChild(aElm);
    document.body.appendChild(divElm);
  } else {
    const aElm = root.querySelector('a');
    aElm.setAttribute('href', blobUrl);
    aElm.setAttribute('download', fileName);
  }
  const divFileDownload = (document.querySelector('.download-attachement a')) as HTMLElement;
  divFileDownload.click();
  document.querySelector('.download-attachement').remove();
}


function request(url: string, method: string, data: any, header: any, responseType?: XMLHttpRequestResponseType, onloadStart?: any, onloadEnd?: any) {
  return new kintone.Promise((resolve: Function, reject: Function) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (responseType) {
      xhr.responseType = responseType;
    }
    for (const i in header) {
      if (Object.prototype.hasOwnProperty.call(header, i)) {
        xhr.setRequestHeader(i, header[i]);
      }
    }

    if (onloadStart) {
      xhr.onloadstart = onloadStart;
    }
    if (onloadEnd) {
      xhr.onloadend = onloadEnd;
    }
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.responseText);
      }
    };
    xhr.send(data);
  });
}

export default {timestampToString, utcToString, fileToBase64, b64toBlob, handleError, resizeImage, humanFileSize, createElmDownloadFile, request};