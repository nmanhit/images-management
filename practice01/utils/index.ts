import {SOMETHING_WENT_WRONG} from '../constants/message';
import {RESIZE_IMAGE} from '../config';

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

export default {timestampToString, utcToString, fileToBase64, b64toBlob, handleError, resizeImage};