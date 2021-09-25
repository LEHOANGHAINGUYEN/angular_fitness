import Core from './core';
import Shared from './shared';
import StudioView from './studio-view';
import CorporateView from './corporate-view';
import auth from './authorization';

let modules = {};

if (PROD || UAT) {
  modules = {
    auth,
    core: Core,
    shared: Shared,
    studio: StudioView,
    corporate: CorporateView
  };
} else if (DEV || TEST || SIT) {
  modules = {
    auth,
    core: Core,
    shared: Shared,
    studio: StudioView,
    corporate: CorporateView
  };
}

export let makeRoutes = {};
export let redux = {};
export let breadcrumbs = {};

Object.keys(modules).forEach(key => {
  const mod = modules[key];
  breadcrumbs[key] = mod.breadcrumbs || {};
  makeRoutes[key] = mod.makeRoutes || {};
  Object.keys(mod.redux || {}).forEach(rdKey => {
    const rd = mod.redux[rdKey];
    redux[`${key}_${rdKey}`] = rd || {};
  });
});
