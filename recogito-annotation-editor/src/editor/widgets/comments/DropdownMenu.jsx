import React, { useEffect, useRef } from 'react';

const DropdownMenu = props => {

  const ref = useRef();

  const onClickOutside = _ => {
    if (ref.current && !ref.current.contains(event.target))
      props.onClickOutside();
  }

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);

    return () =>
      document.removeEventListener('mousedown', onClickOutside);
  });

  return (
    <ul ref={ref} className="comment-dropdown-menu">
      <li onClick={props.onEdit}>Edit</li>
      <li onClick={props.onDelete}>Delete</li>
    </ul>
  )

}

export default DropdownMenu;