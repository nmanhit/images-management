function timestampToString(timestamp: any) {
    const current = new Date(timestamp);
    const strDate = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    const strTime = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
    return `${strDate} ${strTime}`;
}

function fileToBase64(file: File) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
  });
}

export {timestampToString, fileToBase64};