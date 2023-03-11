/**
 *
 * Attribute
 *
 */

import React from 'react';
import {
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Input,
  FormControl,
  Checkbox,
  Chip,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  withStyles,
  ListItemText,
  FormControlLabel,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const styles = {
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
};

function Attribute(props) {
  const { classes, page } = props;
  const id = page.attributeSelect;
  const attribute = page.attributes.find(item => item.id === id).attributeGroups;

  if (attribute)
    return attribute.map(item => (
      <ExpansionPanel style={{ padding: 5 }}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography variant="subtitle2" color="primary">
            {item.name}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
          {item.attributes.map(at => {
            switch (at.type) {
              case 'text':
              case 'number':
              case 'date':
                return (
                  <TextField
                    name={at.attributeId}
                    value={page[at.attributeId]}
                    onChange={props.handleChangeAtt(at.attributeId)}
                    type={at.type}
                    fullWidth
                    label={at.name}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                );
              case 'select':
              case 'list':
                return (
                  <Select
                    value={page[at.attributeId]}
                    onChange={props.handleChangeAtt(at.attributeId)}
                    inputProps={{
                      name: at.attributeId,
                    }}
                  >
                    {at.options.map(name => (
                      <MenuItem key={name.value} value={name.value}>
                        {name.name}
                      </MenuItem>
                    ))}
                  </Select>
                );
              case 'multiSelect':
                return (
                  <FormControl>
                    <InputLabel htmlFor="select-multiple-chip">{at.name}</InputLabel>
                    <Select
                      multiple
                      value={page[at.attributeId]}
                      onChange={props.handleChangeAtt(at.attributeId)}
                      input={<Input id="select-multiple-chip" />}
                      renderValue={selected => (
                        <div className={classes.chips}>
                          {selected.map(value => (
                            <Chip
                              onDelete={() => props.handleRemove(at.attributeId, selected.filter(it => it !== value))}
                              key={value}
                              label={at.options.find(item => item.value === value).name}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      )}
                      MenuProps={MenuProps}
                    >
                      {at.options.map(name => (
                        // <MenuItem key={name.value} value={name.value}>
                        //   {name.name}
                        // </MenuItem>
                        <MenuItem key={name.value} value={name.value}>
                          <Checkbox color="primary" checked={page[at.attributeId].includes(name.value)} />
                          <ListItemText primary={name.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              case 'bool':
                return (
                  <FormControlLabel
                    control={<Checkbox checked={page[at.attributeId]} onChange={props.handleChecked(at.attributeId)} />}
                    label={at.name}
                  />
                );

              default:
                return (
                  <TextField
                    value={page[at.attributeId]}
                    onChange={props.handleChangeAtt(at.attributeId)}
                    fullWidth
                    label={at.name}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                );
            }
          })}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ));
  return null;
}

Attribute.propTypes = {};

export default withStyles(styles)(Attribute);
