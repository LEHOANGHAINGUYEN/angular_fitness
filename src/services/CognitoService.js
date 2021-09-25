import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

import { Constants, AppConfigs } from 'common';

const config = AppConfigs.getConfig();

class CognitoService {
  getCognitoUserPool() {
    return new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
  }

  /**
   * Get current user from local storage
   * @returns {CognitoUser} Congito user
   */
  getCurrentUser() {
    const userPool = this.getCognitoUserPool();
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser !== null) {
      return cognitoUser.getSession((err) => {
        if (err) {
          return null;
        }
        return cognitoUser;
      });
    }

    return cognitoUser;
  }

  confirm(user, confirmationCode) {
    return new Promise((resolve, reject) => (
      user.confirmRegistration(confirmationCode, true, function (err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      })
    ));
  }

  resetPassword(username) {
    const userPool = this.getCognitoUserPool();
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });

    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess (result) {
          return resolve(result);
        },
        onFailure (err) {
          reject(err);
        }
      });
    });
  }

  confirmPassword(username, verificationCode, newPassword) {
    const userPool = this.getCognitoUserPool();
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess (result) {
          return resolve(result);
        },
        onFailure (err) {
          reject(err);
        }
      });
    });
  }

    /**
   * Refresh access token
   * @returns {CognitoUser} Congito user
   */
  refreshToken() {
    return new Promise((resolve, reject) => {
      const userPool = this.getCognitoUserPool();
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser !== null) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(err);

            return;
          }
          resolve(session.getIdToken().getJwtToken());
        });
      } else {
        reject('Failed to retrieve user from localStorage');
      }
    });
  }

  /**
   * Login using Cognito
   * @param  {String} username The cognito username (user email)
   * @param  {String} password The cognito login password
   * @returns {Promise<any>} The token generate response
   */
  login(username, password) {
    const userPool = this.getCognitoUserPool();
    const authenticationData = {
      Username: username,
      Password: password
    };
    let user;

    try {
      user = new CognitoUser({ Username: username, Pool: userPool });
    } catch (error) {
      return Promise.reject(error);
    }

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => (
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            status: Constants.CognitoStatus.Success,
            data: result
          });
        },
        onFailure: (err) => reject(err),
        newPasswordRequired: (userAttributes) => {
          resolve({
            status: Constants.CognitoStatus.NewPasswordRequired,
            userAttributes
          });
        }
      })
    ));
  }

  /**
   * Set new password at the first time login
   * @param  {String} username The cognito username (user email)
   * @param  {String} password The cognito login password
   * @param  {String} newPassword New password input by user
   * @returns {Promise<any>} The token generate response
   */
  completeNewPassword(username, password, newPassword) {
    const userPool = this.getCognitoUserPool();
    const authenticationData = {
      Username: username,
      Password: password
    };

    const user = new CognitoUser({ Username: username, Pool: userPool });
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => (
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            status: Constants.CognitoStatus.Success,
            token: result.getIdToken().getJwtToken()
          });
        },
        onFailure: (err) => reject(err),
        newPasswordRequired: (userAttributes) => {
          delete userAttributes.email_verified;
          delete userAttributes.phone_number_verified;

          user.completeNewPasswordChallenge(newPassword, userAttributes, {
            onSuccess: (result) => {
              resolve({
                status: Constants.CognitoStatus.SetNewPasswordSuccess,
                data: result
              });
            },
            onFailure: (err) => reject(err)
          });
        }
      })
    ));
  }

  /**
   * Changes the current password of an authenticated user
   * @param  {string} oldPassword The current password
   * @param  {string} newPassword The new password
   * @returns {Promise<any>} Promise with thenable
   */
  changePassword(oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  /**
   * Signs the current user out from the application
   */
  logout() {
    if (this.getCurrentUser()) {
      this.getCurrentUser().signOut();
    }
  }
}

export default new CognitoService();
