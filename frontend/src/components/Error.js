import Alert from 'react-bootstrap/Alert';

export default function Error(props) {
  return <Alert variant={props.variant || 'info'}>{props.children}</Alert>;
}