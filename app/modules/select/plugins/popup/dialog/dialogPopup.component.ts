import {DialogPopupOptions, DialogPopup, DialogPopupContentComponent} from "./dialogPopup.interface";
import {ChangeDetectionStrategy, AfterViewInit, OnDestroy, Component, EventEmitter, Inject, Optional, ElementRef, ChangeDetectorRef, Type, resolveForwardRef, forwardRef} from "@angular/core";
import {NgSelectPluginGeneric, OptionsGatherer, NormalState, KeyboardHandler, ValueHandler, TemplateGatherer, NgSelectOption, ɵNgSelectOption, NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances, POPUP_OPTIONS, NORMAL_STATE, KEYBOARD_HANDLER, VALUE_HANDLER} from "@anglr/select";
import {Subscription} from "rxjs";
import {extend} from "jquery";
import {DOCUMENT} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {BasicDialogPopupComponent} from "./basicDialogPopup.component";

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: DialogPopupOptions =
{
    dialogComponent: forwardRef(() => BasicDialogPopupComponent),
    cssClasses:
    {
        optionChecked: 'fa fa-check',
        optionItemDiv: 'option-item',
        optionItemTextDiv: 'option-item-text',
        popupDiv: 'popup-div'
    },
    visible: false
};

/**
 * Component used for rendering basic popup with options
 */
@Component(
{
    selector: "div.ng-select-dialog-popup",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogPopupComponent implements DialogPopup, NgSelectPluginGeneric<DialogPopupOptions>, AfterViewInit, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: DialogPopupOptions;

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer<any>;

    /**
     * Subscription for changes of options in options gatherer
     */
    protected _optionsChangeSubscription: Subscription;

    /**
     * Subscription for click event on normal state
     */
    protected _clickSubscription: Subscription;

    /**
     * Subscription for popup visibility request from keyboard handler
     */
    protected _khPopupVisibilityRequestSubscription: Subscription;

    /**
     * Subscription for popup visibility request from value handler
     */
    protected _vhPopupVisibilityRequestSubscription: Subscription;

    /**
     * Normal state that is displayed
     */
    protected _normalState: NormalState;

    /**
     * Keyboard handler that is used
     */
    protected _keyboardHandler: KeyboardHandler;

    /**
     * Value handler that is used
     */
    protected _valueHandler: ValueHandler<any>;

    /**
     * Indication whether is popup visible
     */
    protected _popupVisible: boolean = false;

    /**
     * Component that is used for handling metadata selection itself
     */
    protected _dialogComponent?: Type<DialogPopupContentComponent<any>>;

    //######################### public properties - implementation of BasicPopup #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): DialogPopupOptions
    {
        return this._options;
    }
    public set options(options: DialogPopupOptions)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<any>;

    /**
     * Gatherer used for obtaining custom templates
     */
    public templateGatherer: TemplateGatherer;

    /**
     * HTML element that represents select itself
     */
    public selectElement: HTMLElement;

    /**
     * Occurs when user clicks on option, clicked options is passed as argument
     */
    public optionClick: EventEmitter<NgSelectOption<any>> = new EventEmitter<NgSelectOption<any>>();

    /**
     * Occurs when visibility of popup has changed
     */
    public visibilityChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Html element that represents popup itself
     */
    public get popupElement(): HTMLElement
    {
        return null;
    }

    //######################### public properties - template bindings #########################

    /**
     * Array of select options available
     * @internal
     */
    public selectOptions: ɵNgSelectOption<any>[];

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                protected _dialog: MatDialog,
                @Inject(POPUP_OPTIONS) @Optional() options?: DialogPopupOptions,
                @Inject(DOCUMENT) protected _document?: HTMLDocument)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of AfterViewInit #########################

    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._optionsChangeSubscription)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;
        }

        if(this._clickSubscription)
        {
            this._clickSubscription.unsubscribe();
            this._clickSubscription = null;
        }

        if(this._khPopupVisibilityRequestSubscription)
        {
            this._khPopupVisibilityRequestSubscription.unsubscribe();
            this._khPopupVisibilityRequestSubscription = null;
        }

        if(this._vhPopupVisibilityRequestSubscription)
        {
            this._vhPopupVisibilityRequestSubscription.unsubscribe();
            this._vhPopupVisibilityRequestSubscription = null;
        }
    }

    //######################### public methods - implementation of BasicPopup #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        this._dialogComponent = resolveForwardRef(this.options.dialogComponent);

        if(this._optionsGatherer && this._optionsGatherer != this.optionsGatherer)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;

            this._optionsGatherer = null;
        }

        if(!this._optionsGatherer)
        {
            this._optionsGatherer = this.optionsGatherer;

            this._optionsChangeSubscription = this._optionsGatherer.availableOptionsChange.subscribe(() => this.loadOptions());
        }

        let normalState = this.ngSelectPlugins[NORMAL_STATE] as NormalState;

        if(this._normalState && this._normalState != normalState)
        {
            this._clickSubscription.unsubscribe();
            this._clickSubscription = null;

            this._normalState = null;
        }

        if(!this._normalState)
        {
            this._normalState = normalState;

            this._clickSubscription = this._normalState.click.subscribe(() => this.togglePopup());
        }

        let keyboardHandler = this.ngSelectPlugins[KEYBOARD_HANDLER] as KeyboardHandler;

        if(this._keyboardHandler && this._keyboardHandler != keyboardHandler)
        {
            this._khPopupVisibilityRequestSubscription.unsubscribe();
            this._khPopupVisibilityRequestSubscription = null;

            this._keyboardHandler = null;
        }

        if(!this._keyboardHandler)
        {
            this._keyboardHandler = keyboardHandler;

            this._khPopupVisibilityRequestSubscription = this._keyboardHandler.popupVisibilityRequest.subscribe(this._showDialog);
        }

        let valueHandler = this.ngSelectPlugins[VALUE_HANDLER] as ValueHandler<any>;

        if(this._valueHandler && this._valueHandler != valueHandler)
        {
            this._vhPopupVisibilityRequestSubscription.unsubscribe();
            this._vhPopupVisibilityRequestSubscription = null;

            this._valueHandler = null;
        }

        if(!this._valueHandler)
        {
            this._valueHandler = valueHandler;

            this._vhPopupVisibilityRequestSubscription = this._valueHandler.popupVisibilityRequest.subscribe(this._showDialog);
        }

        this.loadOptions();
    }

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    public initOptions()
    {
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    //######################### protected methods #########################

    /**
     * Loads options
     */
    protected loadOptions()
    {
        this.selectOptions = this._optionsGatherer.availableOptions;
        this._changeDetector.detectChanges();
    }

    /**
     * Toggles popup visibility
     */
    protected togglePopup()
    {
        this._showDialog();
    }

    /**
     * Handles visibility change
     */
    protected _showDialog = () =>
    {
        console.log(this._optionsGatherer.availableOptions);
        this._dialog.open(this._dialogComponent,
            {
                data: 
                {
                    options: this.selectOptions
                }
            });
    };
}