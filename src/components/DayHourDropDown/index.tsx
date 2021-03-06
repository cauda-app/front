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
    <Form.Group controlId={`shop-${dayOfWeek}`} className="mb-2">
      <Row className="align-items-baseline" noGutters>
        <Col xs={5}>
          <Form.Check
            inline
            name={`${dayOfWeek}IsOpen`}
            type="switch"
            checked={active}
            onChange={onActiveChange}
            disabled={disabled}
            className="mr-0 d-block"
            label={label}
          />
        </Col>
        <Col className="pr-1">
          <Form.Control
            as="select"
            size="sm"
            custom
            value={openValue}
            name={`${dayOfWeek}IsOpen`}
            disabled={disabled || !active}
            className="d-inline"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onOpenChange(e.target.value)
            }
          >
            {timeOptions.map((time, index) => (
              <option key={index} value={time + ':00Z'}>
                {time}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col className="pl-1">
          <Form.Control
            as="select"
            size="sm"
            custom
            value={closeValue}
            name={`${dayOfWeek}IsClose`}
            disabled={disabled || !active}
            className="d-inline"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onCloseChange(e.target.value)
            }
          >
            {timeOptions.map((time, index) => (
              <option key={index} value={time + ':00Z'}>
                {time}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>
    </Form.Group>
  );
}
