import './DropDownButton.css';
import * as React from 'react';

function DropDownButton() {
const handleMenuOne = () => {
    console.log('clicked one');
  };

  const handleMenuTwo = () => {
    console.log('clicked two');
  };

  return (
    <Dropdown className = 'RetryDropdown'
      trigger={<button>Dropdown</button>}
      menu={[
      ]}
    />
  );
};

const Dropdown = ({ trigger, menu }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="dropdown">
      {React.cloneElement(trigger, {
        onClick: handleOpen,
      })}
      {open ? (
        <ul className="menu">
          {menu.map((menuItem, index) => (
            <li key={index} className="menu-item">
              {React.cloneElement(menuItem, {
                onClick: () => {
                  menuItem.props.onClick();
                  setOpen(false);
                },
              })}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
      );
}

export default DropDownButton;