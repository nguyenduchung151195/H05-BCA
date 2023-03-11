import Logger from './Logger';

const logger = new Logger('utils');

let mediaQueryDetectorElem;

export default {
  initialize() {
    logger.debug('initialize()');

    // Media query detector stuff
    mediaQueryDetectorElem = document.getElementById('tryit-jssip-media-query-detector');

    return Promise.resolve();
  },

  isDesktop() {
    return Boolean(!document.getElementById('tryit-jssip-media-query-detector').offsetParent);
  },

  isMobile() {
    return !document.getElementById('tryit-jssip-media-query-detector').offsetParent;
  },
};
