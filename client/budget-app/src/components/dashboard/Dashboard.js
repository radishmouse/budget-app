import React, { Component } from "react";
import PlaidLinkButton from "react-plaid-link-button";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getAccounts, addAccount } from "../../actions/accountActions";

import Accounts from "./Accounts";
import Spinner from "./Spinner";
class Dashboard extends Component {
  componentDidMount() {
    this.props.getAccounts();
  }
// Logout
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
// Add account
  handleOnSuccess = (token, metadata) => {
    const plaidData = {
      public_token: token,
      metadata: metadata
    };

this.props.addAccount(plaidData);
  };

render() {
    const { user } = this.props.auth;
    const { accounts, accountsLoading } = this.props.plaid;

let dashboardContent;

if (accounts === null || accountsLoading) {
      dashboardContent = <Spinner />
    } else if (accounts.length > 0) {
      // User has accounts linked
      dashboardContent = <Accounts user={user} accounts={accounts} />;
    } else {
      // User has no accounts linked
      dashboardContent = (
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Welcome,</b> {user.name.split(" ")[0]}
            </h4>
            <p className="flow-text grey-text text-darken-1">
              To get started, link your first bank account below
            </p>
            <useLayoutEffect>
              <PlaidLinkButton 
                buttonProps={{

                  className:
                    "btn btn-large waves-effect waves-light hoverable grey accent-3 main-btn",
                }}
                plaidLinkProps={{
                  clientName: "budget-app",
                  key: "065559fb6c1b46df796add99014df6",
                  env: "sandbox",
                  product: ["transactions"],
                  onSuccess: this.handleOnSuccess
                }}
                onScriptLoad={() => this.setState({ loaded: true })}

              >
                Link Account
              </PlaidLinkButton>
            </useLayoutEffect>
            <button
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable green accent-3 main-btn"
              style={{color: 'black', marginRight: 10, marginLeft: 10}}
            >
              Logout
            </button>
            <button
            className="btn btn-large waves-effect waves-light hoverable red accent-3 main-btn"
            >
              <a style={{
                color: "black"
              }}href="/Budget">
                  budget page
              </a>
            </button>
          </div>
        </div>
      );
    }
return <div className="container">{dashboardContent}</div>;
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getAccounts: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  plaid: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  plaid: state.plaid
});
export default connect(
  mapStateToProps,
  { logoutUser, getAccounts, addAccount }
)(Dashboard);