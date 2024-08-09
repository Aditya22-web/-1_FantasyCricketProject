import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-autocomplete';

const PlayerInput = ({ playerList }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    console.log('PlayerList prop:', playerList);
  }, [playerList]);

  return (
    <Autocomplete
      items={playerList}
      shouldItemRender={(item, value) => {
        const shouldRender = item.toLowerCase().indexOf(value.toLowerCase()) > -1;
        console.log('shouldItemRender:', { item, value, shouldRender });
        return shouldRender;
      }}
      getItemValue={item => item}
      renderItem={(item, highlighted) => {
        console.log('renderItem:', { item, highlighted });
        return (
          <div
            key={item}
            style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
            className="p-2 cursor-pointer"
          >
            {item}
          </div>
        );
      }}
      value={value}
      onChange={(e) => {
        console.log('onChange:', e.target.value);
        setValue(e.target.value);
      }}
      onSelect={(val) => {
        console.log('onSelect:', val);
        setValue(val);
      }}
      wrapperStyle={{ position: 'relative', display: 'inline-block' }}
      inputProps={{
        className: 'border border-gray-300 rounded-md p-2 w-full',
        placeholder: 'Enter player name'
      }}
      menuStyle={{
        borderRadius: '3px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '2px 0',
        fontSize: '90%',
        position: 'fixed',
        overflow: 'auto',
        maxHeight: '50%',
        zIndex: '1'
      }}
    />
  );
};

export default PlayerInput;
