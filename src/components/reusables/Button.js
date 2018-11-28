import React from 'react';
import CSS from '../../css/reusables/Button.module.css';

function Button({ icon, ...props }) {
  // If icon, display icon ahead of btn.
  return (
    <button className={`${CSS.Button} ${icon && CSS.iconContainer}`} type="button" {...props}>
      {icon && <img src={icon} className={CSS.icon} alt="Icon" />}
      <span className={CSS.text}>{props.children}</span>
    </button>
  );
}

export default Button;
