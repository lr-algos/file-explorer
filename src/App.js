import React, { useEffect, useState } from "react";
import api from './api';
import { 
  ArrowRight,
  ArrowDown,
  X,
} from './assets/icons'

import utils from './utils';


export default function App() {
  const[directory, setDirectory] = useState();
  const [hoverValue, setHoverValue] = useState({});

  const iterate = (item) => {
    if(item.type === 'file') {
      item.isVisible = true;
    } else if(item.type === 'folder') {
      item.isVisible = false;
      item.children.map(subitem => iterate(subitem))
    }
    setHoverValue(hoverValue)
  }
 
  const getDirectory = async() => {
    const data =  await api.getDirectoryTree();
    data?.children.map(item => iterate(item));
    setDirectory(data);
  }

  useEffect(() => {
    getDirectory()
  },[])


  const updatedFolder = (item, property) => {
    return directory.children.map(folder => utils.updateProperty(folder, item, property))
  }

  const toggleFolder = (item, property)  => {
    const updated = updatedFolder(item, property);
    
    setDirectory(directory => ({
      ...directory,
      children: updated,
    }));
  }


  const deleteItem = async (item) => {
    const dir = await api.deleteById(item.id);
    setDirectory(dir);
  }

  const mouseEnterVal = (item) => {
    setHoverValue({
      ...hoverValue,
      [item.id]: true
    })
  }

  const mouseLeaveVal = (item) => {
    delete hoverValue[item.id]
    setHoverValue(hoverValue)
  }

 
  const renderList = (item) => {
      
      if(item.type === 'file' && !item.isDelete) {
        return (<ul>
          <li key={item.id} className='list'>
            <button
              onMouseEnter={() => mouseEnterVal(item)}
              onMouseLeave={() => mouseLeaveVal(item)}
              className='button'
            >
              <div className='listLeft'>
                <div>{utils.getIcon(item)}</div>
                <div className='name'>{item.name}</div>
              </div>
              <div
                className='deleteButton'
                onClick={() => deleteItem(item) }
              >
                {hoverValue[item.id] && <X/>}
              </div>
            </button>
           
          </li>
        </ul>)
      } else if(item.type === 'folder' && !item.isDelete) {
        return (
        <ul>
          <li key={item.id} className='list'>
            <button
            onMouseEnter={() => mouseEnterVal(item)}
            onMouseLeave={() => mouseLeaveVal(item)}
            className='button'
            >
              <div className='listLeft'>
                <div onClick={() => toggleFolder(item, 'isVisible')}> {item.isVisible ? <ArrowDown /> : <ArrowRight />}</div>
                <div className='name'>{item.name}</div>
              </div>
              <div
                className='deleteButton'
                onClick={() => deleteItem(item) }
              >
                {hoverValue[item.id] && <X/>}
              </div>
            </button>
            
          </li>
          
          {item.isVisible && item?.children.map(subitem => {
            return renderList(subitem);
          })}
        
        </ul>)
      }
  }
  
  const renderItem = (data) => {
    const directoryList = data || directory

    let list;

     if(directoryList?.type === 'project') {
       list = directoryList?.children?.map(item => {
        return renderList(item);
      })
     }    

    return (
    <ul style={{marginLeft: '-70px'}}>
      {list}
    </ul>)
  }
 
  
  return (
    directory ? <div style={{paddingLeft: '5px'}}>
      
      <div className='title'>{directory.name.toUpperCase()}</div>
      
      {directory?.children && renderItem()}
      <div className='vl'></div>
      
      </div>: <div>Loading...</div>
  );
}
