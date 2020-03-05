import {NgModule} from "@angular/core";
import {NgSelectModule, NgSelectDynamicModule} from "@anglr/select";
import {DialogPopupModule} from "@anglr/select/material";

import {CommonSharedModule} from "../../../../boot/commonShared.module";
import {FilterDialogDirective} from "../../directives";
import {FilterDialogNormalStateComponent, FilterDialogPopupComponent} from "../../components";
import {GridDataService} from "../../../../services/api/gridData/gridData.service";

/**
 * Module for example component
 */
@NgModule(
{
    imports:
    [
        CommonSharedModule,
        DialogPopupModule,
        NgSelectModule,
        NgSelectDynamicModule
    ],
    declarations:
    [
        FilterDialogNormalStateComponent,
        FilterDialogPopupComponent,
        FilterDialogDirective
    ],
    exports:
    [
        FilterDialogDirective
    ],
    providers:
    [
        GridDataService
    ]
})
export class FilterDialogModule
{
}