const styles = () => ({
  MuitableCell: {
    padding: '4px',
    width: '120px',
    '& div div': {
      '&': {
        border: '1px solid rgb(224 224 224)',
      },
      '&::before': {
        border: 'none',
      },
      '& input': {
        padding: '8px 4px',
        maxWidth: '120px',
      },
    },
    '& span': {
      '& button': {
        padding: '6px',
        margin: '0 1.5px 0 3px',
        minWidth: '30px',
      },
    },
  },
});

export default styles;
