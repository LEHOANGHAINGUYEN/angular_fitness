import * as LanguageRedux from './config/redux/language';
import * as TableRedux from './config/redux/table';
import * as LoadingIndicatorRedux from './config/redux/loading-indicator';
import * as ModalRedux from './config/redux/modal';
import * as SplashRedux from './config/redux/splash';
import * as ErrorHandlerRedux from './config/redux/error-handler';
import * as AlertRedux from './config/redux/alert';
import * as KeyboardRedux from './config/redux/keyboard';
import * as FullscreenRedux from './config/redux/fullscreen';

const CoreModule = {
  makeRoutes: () => {},
  redux: {
    language: LanguageRedux,
    table: TableRedux,
    loading: LoadingIndicatorRedux,
    modal: ModalRedux,
    splash: SplashRedux,
    errorHandler: ErrorHandlerRedux,
    alert: AlertRedux,
    keyboard: KeyboardRedux,
    screen: FullscreenRedux
  }
};

export default CoreModule;
