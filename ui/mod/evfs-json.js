import { fileOpen } from '../browser-fs-access/src/file-open.mjs';
import { fileSave } from '../browser-fs-access/src/file-save.mjs';

async function fsOpen(openButton,callback){
  openButton.click(async () => {
    try {
      const blob = await fileOpen({
        description: 'Json files',
        mimeTypes: ['application/json'],
        extensions: ['.json'],
      });
     if (blob.type.startsWith('application/json')) {
       callback(await blob.text());
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log('FS abort to open');
    }
  });
  openButton.attr({disabled:false});
}

async function fsSave(saveButton,callback){
  saveButton.click(async () => {
    const blob = callback();
    try {
      await fileSave(blob, {
        description: 'Json files',
        mimeTypes: ['application/json'],
        extensions: ['.json'],
        fileName: 'default.json'
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log('FS abort to save');
    }
  });
  saveButton.css({disabled:false});
}

export {fsOpen,fsSave};
