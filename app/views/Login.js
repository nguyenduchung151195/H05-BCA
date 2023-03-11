import React from 'react';
import PropTypes from 'prop-types';

// material-ui components
import { withStyles, InputAdornment } from '@material-ui/core';

// material-ui-icons
import { Email, Lock } from '@material-ui/icons';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import LoginCard from 'components/Cards/LoginCard';
import CustomInput from 'components/CustomInput/CustomInput';
import Button from 'components/CustomButtons/Button';

import loginPageStyle from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: 'cardHidden',
      password: '',
      email: '',
    };
  }

  // lấy thông tin đăng nhập
  handleSubmit() {
    // console.log(this.props);
    const { email, password } = this.state;
    this.props.authentication({ email, password });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(() => {
      this.setState({ cardAnimaton: '' });
    }, 700);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.content}>
        <div className={classes.container}>
          {/* <GridContainer justify="center">
            <ItemGrid xs={12} sm={6} md={4}>
              <form>
                <LoginCard
                  customCardClass={classes[this.state.cardAnimaton]}
                  headerColor="blue"
                  cardTitle="Đăng nhập"
                  // cardSubtitle="Or Be Classical"
                  footerAlign="center"
                  footer={
                    <Button onClick={() => this.handleSubmit()} color="info" wd size="lg">
                      Đăng nhập
                    </Button>
                  }
                  socials={['fab fa-facebook-square', 'fab fa-twitter', 'fab fa-google-plus'].map(prop => (
                    <Button justicon key={prop} customClass={classes.customButtonClass}>
                      <i className={prop} />
                    </Button>
                  ))}
                  content={
                    <div>
                      <CustomInput
                        labelText="Email..."
                        id="email"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          value: this.state.email,

                          name: 'email',
                          onChange: e => this.handleChange(e),
                        }}
                      />
                      <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Lock className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          value: this.state.password,
                          name: 'password',
                          type: 'password',
                          onChange: e => this.handleChange(e),
                        }}
                      />
                    </div>
                  }
                />
              </form>
            </ItemGrid>
          </GridContainer> */}
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  authentication: PropTypes.object,
};

export default withStyles(loginPageStyle)(LoginPage);
