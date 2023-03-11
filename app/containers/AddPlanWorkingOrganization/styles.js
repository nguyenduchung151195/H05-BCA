
const styles = {
    cell: {
        border: '1px solid !important',
        paddingRight: '0 !important',
        padding: '1px 4px',
        transition: 'all .2s',
        '&:hover th ':{
            backgroundColor: 'white'
        },
        '& div': {
            margin: 0,
        },
        '& div div fieldset': {
            borderColor: 'white!important'
        },
        '&:hover':{
            backgroundColor: '#e5e2e2'
        }
    },
    cellTh:{
        border: '1px solid !important',
        padding: '0',
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
       
        '& div div fieldset': {
            borderColor: 'white!important'
        }
    }
}

export default styles;