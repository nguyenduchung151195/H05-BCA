import React from 'react';
import TextField from '@material-ui/core/TextField';

function TextFields() {
  const [values, setValues] = React.useState({
    name: 'Cat in the Hat',
    error: false,
    mimi: true,
  });

  const handleChange = name => event => {
    const rule = /^\d{10,11}$/;
    if (rule.test(event.target.value)) setValues({ ...values, [name]: event.target.value, error: false });
    else setValues({ ...values, [name]: event.target.value, error: true });
  };

  return (
    <form noValidate autoComplete="off">
      <TextField id="standard-name" label="Name" value={values.name} onChange={handleChange('name')} margin="normal" />
      {values.error ? <p style={{ color: 'red' }}>Sai định dạng sdt</p> : null}
    </form>
  );
}

export default TextFields;
