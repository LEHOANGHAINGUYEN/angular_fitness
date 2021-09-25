import productionConfigs from './env/production.json';
import developmentConfigs from './env/development.json';
import sitConfigs from './env/sit.json';
import testConfigs from './env/test.json';
import uatConfigs from './env/uat.json';

/**
 * Load the environment configuration with specific environment such as production
 */
class Config {
  constructor() {
    // Load the environment configuration
    if (PROD) {
      this.config = productionConfigs;
    } else if (UAT) {
      this.config = uatConfigs;
    } else if (SIT) {
      this.config = sitConfigs;
    } else if (TEST) {
      this.config = testConfigs;
    } else if (DEV) {
      this.config = developmentConfigs;
    }
  }

  /**
   * Get the current environment configuration object which is loaded in the load() function
   * @return {object}
   */
  getConfig() {
    return this.config;
  }

  getUnauthorizeEndpoint() {
    return this.config.UnauthorizeEndpoint;
  }

  getAuthorizeEndpoint() {
    return this.config.AuthorizeEndpoint;
  }

  getPageSize() {
    return this.config.PageSize;
  }

  getOTumFranchiseEndpoint() {
    return this.config.OTumFranchiseEndpoint;
  }
  getAuthorizeGlobalEndpoint() {
    return this.config.AuthorizeGlobalEndpoint;
  }
  getEdenMboEndpoint() {
    return this.config.EdenMboEndpoint;
  }
}

export default new Config();
