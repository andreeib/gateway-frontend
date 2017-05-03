/*
 * Copyright (C) 2016 OpenMotics BVBA
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import {PLATFORM} from "aurelia-pal";
import {AdminLTE} from "admin-lte";
import {inject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {Base} from "./resources/base";
import {Storage} from "./components/storage";
import {Authentication} from "./components/authentication";

@inject(Router, Authentication)
export class Index extends Base {
    constructor(router, authenication, ...rest) {
        super(...rest);
        this.router = router;
        this.authentication = authenication;
        this.version = __VERSION__;
    };

    // Aurelia
    activate() {
        this.router.configure((config) => {
            config.title = 'OpenMotics';
            config.addAuthorizeStep({
                run: (navigationInstruction, next) => {
                    if (navigationInstruction.config.auth) {
                        if (!this.authentication.isLoggedIn) {
                            return next.cancel(this.authentication.logout());
                        }
                    }
                    return next();
                }
            });
            config.addPostRenderStep({
                run: (navigationInstruction, next) => {
                    if (navigationInstruction.config.land) {
                        Storage.setItem('last', navigationInstruction.config.route);
                        let parent = navigationInstruction.config.settings.parent;
                        if (parent !== undefined) {
                            Storage.setItem('last_' + parent, navigationInstruction.config.route);
                        }
                    }
                    return next();
                }
            });
            config.map([
                {
                    route: '', redirect: Storage.getItem('last') || 'dashboard'
                },
                {
                    route: 'dashboard', name: 'dashboard', moduleId: PLATFORM.moduleName('pages/dashboard', 'main-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'dashboard', title: this.i18n.tr('pages.dashboard.title')}
                },
                {
                    route: 'outputs', name: 'outputs', moduleId: PLATFORM.moduleName('pages/outputs', 'main-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'outputs', title: this.i18n.tr('pages.outputs.title')}
                },
                {
                    route: 'thermostats', name: 'thermostats', moduleId: PLATFORM.moduleName('pages/thermostats', 'main-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'thermostats', title: this.i18n.tr('pages.thermostats.title')}
                },
                {
                    route: 'energy', name: 'energy', moduleId: PLATFORM.moduleName('pages/energy', 'main-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'energy', title: this.i18n.tr('pages.energy.title')}
                },
                {
                    route: 'settings', name: 'settings', nav: true, redirect: Storage.getItem('last_settings') || 'settings/initialisation',
                    settings: {key: 'settings'}
                },
                {
                    route: 'settings/initialisation', name: 'settings.initialisation', moduleId: PLATFORM.moduleName('pages/settings/initialisation', 'settings-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'settings.initialisation', title: this.i18n.tr('pages.settings.initialisation.title'), parent: 'settings'}
                },
                {
                    route: 'settings/outputs', name: 'settings.outputs', moduleId: PLATFORM.moduleName('pages/settings/outputs', 'settings-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'settings.outputs', title: this.i18n.tr('pages.settings.outputs.title'), parent: 'settings'}
                },
                {
                    route: 'settings/inputs', name: 'settings.inputs', moduleId: PLATFORM.moduleName('pages/settings/inputs', 'settings-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'settings.inputs', title: this.i18n.tr('pages.settings.inputs.title'), parent: 'settings'}
                },
                {
                    route: 'settings/sensors', name: 'settings.sensors', moduleId: PLATFORM.moduleName('pages/settings/sensors', 'settings-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'settings.sensors', title: this.i18n.tr('pages.settings.sensors.title'), parent: 'settings'}
                },
                {
                    route: 'settings/thermostats', name: 'settings.thermostats', moduleId: PLATFORM.moduleName('pages/settings/thermostats', 'settings-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'settings.thermostats', title: this.i18n.tr('pages.settings.thermostats.title'), parent: 'settings'}
                },
                {
                    route: 'settings/groupactions', name: 'settings.groupactions', moduleId: PLATFORM.moduleName('pages/settings/groupactions', 'settings-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'settings.groupactions', title: this.i18n.tr('pages.settings.groupactoins.title'), parent: 'settings'}
                },
                {
                    route: 'settings/environment', name: 'settings.environment', moduleId: PLATFORM.moduleName('pages/settings/environment', 'settings-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'settings.environment', title: this.i18n.tr('pages.settings.environment.title'), parent: 'settings'}
                },
                {
                    route: 'settings/plugins', name: 'settings.plugins', moduleId: PLATFORM.moduleName('pages/settings/plugins', 'settings-pages'),
                    nav: true, auth: true, land: true,
                    settings: {key: 'settings.plugins', title: this.i18n.tr('pages.settings.plugins.title'), parent: 'settings'}
                },
                {
                    route: 'logout', name: 'logout', moduleId: PLATFORM.moduleName('pages/logout', 'main-pages'),
                    nav: false, auth: false, land: false,
                    settings: {}
                }
            ]);
            config.mapUnknownRoutes({redirect: ''});
        });
    }

    attached() {
        if ($.AdminLTE !== undefined && $.AdminLTE.layout !== undefined) {
            window.addEventListener('aurelia-composed', $.AdminLTE.layout.fix);
            window.addEventListener('resize', $.AdminLTE.layout.fix);
        }
    };

    detached() {
        if ($.AdminLTE !== undefined && $.AdminLTE.layout !== undefined) {
            window.removeEventListener('aurelia-composed', $.AdminLTE.layout.fix);
            window.removeEventListener('resize', $.AdminLTE.layout.fix);
        }
    };
}
