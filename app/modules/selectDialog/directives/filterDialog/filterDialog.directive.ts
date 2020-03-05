import {Directive, ValueProvider} from "@angular/core";
import {POPUP_TYPE, POPUP_OPTIONS, NORMAL_STATE_TYPE, NORMAL_STATE_OPTIONS, BasicNormalStateOptions} from "@anglr/select";
import {DialogPopupComponent, DialogPopupOptions} from "@anglr/select/material";

import {FilterDialogPopupComponent, FilterDialogNormalStateComponent} from "../../components";

/**
 * Directive that applies options for NgSelect which enable usage of NgSelect dialog popup with filter
 */
@Directive(
{
    selector: 'ng-select[filterDialog]',
    providers:
    [
        <ValueProvider>
        {
            provide: NORMAL_STATE_TYPE,
            useValue: FilterDialogNormalStateComponent,
        },
        <ValueProvider>
        {
            provide: NORMAL_STATE_OPTIONS,
            useValue: <BasicNormalStateOptions>
            {
                cssClasses: 
                {
                    selectedCarret: 'fas fa-lg fa-angle-double-right'
                }
            }
        },
        <ValueProvider>
        {
            provide: POPUP_TYPE,
            useValue: DialogPopupComponent
        },
        <ValueProvider>
        {
            provide: POPUP_OPTIONS,
            useValue: <DialogPopupOptions>
            {
                dialogComponent: FilterDialogPopupComponent
            }
        }
    ]
})
export class FilterDialogDirective
{
}