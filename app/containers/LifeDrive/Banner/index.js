import React from 'react'
import InputBase from '@material-ui/core/InputBase';

function Banner() {
  return (
    <>
    <Grid item md ={12} >
        <InputBase
            defaultValue="Naked input"
            inputProps={{ 
                "height": "25px",
                "margin": "0 auto",
                "border":"solid 1px #ccc",
                "border-radius": "10px",
             }}
            placeholder="Try typing `new`"
        />
    </Grid>
    </>
  )
}

export default Banner