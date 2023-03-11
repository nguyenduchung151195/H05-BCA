/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import {
    Avatar,
} from '@material-ui/core';
import _ from 'lodash';
import { testAvatar, checkAvatar } from 'utils/common';

const CustomAvatar = (props) => {
    const { style, src } = props

    const [ava, setAva] = useState()

    useEffect(() => {
        testAvatar(src, () => setAva(src), () => { })
    }, [src])

    return <Avatar style={style} src={checkAvatar(ava)} />
}

export default CustomAvatar