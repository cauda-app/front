import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { timeOptions } from '../../utils';

interface Props {
  label: string;
  dayOfWeek: string;
  active: boolean;
  onActiveChange: (HTMLInputElement) => void;
  openValue: string;
  closeValue: string;
  onOpenChange: (string) => void;
  onCloseChange: (string) => void;
}

export default function DayHourDropDown({
  label,
  dayOfWeek,
  active,
  onActiveChange,
  openValue,
  closeValue,
  onOpenChange,
  onCloseChange,
}: Props) {
  return (
    <Form.Group controlId={`shop-${dayOfWeek}`}>
      <Form.Check
        inline
        name={`${dayOfWeek}IsOpen`}
        type="checkbox"
        checked={active}
        onChange={onActiveChange}
      />
      <Form.Label>{label}</Form.Label>
      <DropdownButton
        id={`${dayOfWeek}-open`}
        name={`${dayOfWeek}Open`}
        title={openValue}
        disabled={!active}
        className="d-inline"
      >
        {timeOptions.map((time, index) => (
          <Dropdown.Item
            key={index}
            active={time === openValue}
            onClick={(e) => onOpenChange(e.target.text)}
          >
            {time}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <DropdownButton
        id={`${dayOfWeek}-close`}
        name={`${dayOfWeek}IsClose`}
        title={closeValue}
        disabled={!active}
        className="d-inline"
      >
        {timeOptions.map((time, index) => (
          <Dropdown.Item
            key={index}
            active={time === closeValue}
            onClick={(e) => onCloseChange(e.target.text)}
          >
            {time}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Form.Group>
  );
}
