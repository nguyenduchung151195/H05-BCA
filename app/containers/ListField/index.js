import React from 'react';
import List from '../../components/List';
import { API_FIELD } from '../../config/urlConfig';
import { fieldColumns } from '../../variable';
import { Typography, Paper } from '../../components/LifetekUi';

function ListField() {
    
    return <Paper className="py-3" style={{ height: '100%' }}><List columns={fieldColumns} apiUrl={API_FIELD} client code="Field" disableImport/></Paper>;
}
export default ListField;
