import {Popup, PopupOptions} from "@anglr/select";

/**
 * Css classes for dialog popup
 */
export interface CssClassesDialogPopup
{
    /**
     * Css class applied to each option div
     */
    optionItemDiv?: string;

    /**
     * Css class applied to each option text div
     */
    optionItemTextDiv?: string;

    /**
     * Css class used as icons indicating that option is selected (only when multiple)
     */
    optionChecked?: string;

    /**
     * Css class applied directly to css popup
     */
    popupDiv?: string;
}

/**
 * Dialog popup options
 */
export interface DialogPopupOptions extends PopupOptions<CssClassesDialogPopup>
{
    /**
     * Component that is used to show in dialog
     */
    dialogComponent: any;
}

export interface DialogPopup extends Popup
{
}

/**
 * Data that are passed to component that handles metadata
 */
export interface DialogPopupComponentData<T>
{
    options: any;
}

/**
 * Component that is rendered within dialog
 */
export interface DialogPopupContentComponent<T>
{
    /**
     * Data that are used for communication with Popup
     */
    data: DialogPopupComponentData<T>;
}