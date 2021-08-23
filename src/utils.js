import { 
    JsFile,
    GitFile,
    CssFile,
    DefaultFile,
    ReadmeFile,
    JsonFile,
    ImageFile,
    YarnFile,
  } from './assets/icons'


const utils = {};

utils.getIcon = (item) => {
    const itemNameType = item.name.split('.');
    const type = itemNameType[itemNameType.length -1];

    let icon;
    switch (type) {
      case 'js':
        icon = <JsFile />
        break;
      case 'gitignore':
        icon = <GitFile />
        break;
      case 'css':
        icon = <CssFile />
        break;
      case 'md':
        icon = <ReadmeFile />
        break;
      case 'json':
        icon = <JsonFile />
        break;
      case 'svg':
        icon = <ImageFile />
        break;
      case 'lock':
        icon = <YarnFile />
        break;
      default:
        icon = <DefaultFile />
    }
    
    return icon;
}

utils.updateProperty = (folder, item, property) => {
    if(folder.id !== item.id && folder.children?.length > 0) {
      folder.children.map(subFolder => utils.updateProperty(subFolder, item, property));
    } else if(folder.id === item.id) {
      if(property === 'isVisible') {
        folder.isVisible = !folder.isVisible;
      }  
    }
    return folder;
  }



export default utils;