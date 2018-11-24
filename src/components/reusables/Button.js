import React from 'react';
import CSS from '../../css/reusables/Button.module.css';

function Button(props) {
  return (
    <button className={CSS.Button} type="button" {...props}>
      {props.children}
    </button>
  );
}

export default Button;
