import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
  disabled: boolean;
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
  disabled,
}: Props) {
  return (
    <Form.Group controlId={`shop-${dayOfWeek}`}>
      <Row className="align-items-baseline">
        <Col>
          <Form.Check
            inline
            name={`${dayOfWeek}IsOpen`}
            type="checkbox"
            checked={active}
            onChange={onActiveChange}
            disabled={disabled}
          />
          <Form.Label>{label}</Form.Label>
        </Col>
        <Col>
          <DropdownButton
            id={`${dayOfWeek}-open`}
            name={`${dayOfWeek}Open`}
            title={openValue}
            disabled={disabled || !active}
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
        </Col>
        <Col>
          <DropdownButton
            id={`${dayOfWeek}-close`}
            name={`${dayOfWeek}IsClose`}
            title={closeValue}
            disabled={disabled || !active}
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
        </Col>
      </Row>
    </Form.Group>
  );
}
