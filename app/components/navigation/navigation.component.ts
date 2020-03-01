import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "@anglr/authentication";
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import * as global from 'config/global';
import * as version from 'config/version';

/**
 * Navigation component containing navigation menu
 */
@Component(
{
    selector: 'nav',
    templateUrl: 'navigation.component.html',
    providers: []
})
export class NavigationComponent implements OnInit, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Subscription for change of authentication
     */
    private _authSubscription: Subscription = null;

    /**
     * Subscription for navigation changes
     */
    private _navigationSubscription: Subscription = null;

    // /**
    //  * Indication whether is code running in browser
    //  */
    // private _isBrowser: boolean = isPlatformBrowser(this._platformId);

    /**
     * Subscription for update check
     */
    private _updateCheckSubscription: Subscription;

    //######################### public properties #########################

    /**
     * List of available languages
     */
    public availableLanguages = global.languages;

    /**
     * Indication that update is available
     */
    public updateAvailable: boolean = false;

    /**
     * Logged user full name
     */
    public fullName: string = "";

    /**
     * Name of active language
     */
    public activeLang: string = "";

    /**
     * Displayed gui version
     */
    public guiVersion: string = `Universal: ${version.version}`;

    //######################### constructor #########################
    constructor(private _authService: AuthenticationService<any>,
                private _router: Router,
                private translate: TranslateService,
                // @Inject(APP_STABLE) private _appStablePromise: Promise<void>,
                )
    {
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this.translate.onLangChange.subscribe(itm =>
        {
            this.activeLang = itm.lang;
        })

        this._authService
            .getUserIdentity()
            .then(userIdentity =>
            {
                if(userIdentity.isAuthenticated)
                {
                    this.fullName = `${userIdentity.firstName} ${userIdentity.surname}`;
                }
            });

        this._authSubscription = this._authService
            .authenticationChanged
            .subscribe(userIdentity =>
            {
                if(userIdentity.isAuthenticated)
                {
                    this.fullName = `${userIdentity.firstName} ${userIdentity.surname}`;
                }
                else
                {
                    this.fullName = '';
                }
            });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._authSubscription)
        {
            this._authSubscription.unsubscribe();
            this._authSubscription = null;
        }

        if(this._navigationSubscription)
        {
            this._navigationSubscription.unsubscribe();
            this._navigationSubscription = null;
        }

        if(this._updateCheckSubscription)
        {
            this._updateCheckSubscription.unsubscribe();
            this._updateCheckSubscription = null;
        }
    }

    //######################### public methods #########################

    /**
     * Activates update
     */
    public activateUpdate()
    {
    }

    /**
     * Changes selected language for translation
     * @param  {string} lang
     */
    public changeLang(lang: string)
    {
        this.translate.use(lang);
    }

    /**
     * Performs logout from system
     */
    public logout()
    {
        this._authService
            .logout()
            .subscribe(data =>
            {
                this._router.navigate(['/login']);
            });
    }
}