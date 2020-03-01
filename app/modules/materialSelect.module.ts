import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {DialogPopupComponent} from "./select/plugins/popup/dialog/dialogPopup.component";
import {BasicDialogPopupComponent} from "./select/plugins/popup/dialog/basicDialogPopup.component";

/**
 * Module allows using of angular material dialog for metadata selector
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        MatDialogModule
    ],
    declarations:
    [
        DialogPopupComponent,
        BasicDialogPopupComponent
    ],
    exports:
    [
        DialogPopupComponent,
        BasicDialogPopupComponent

    ]
})
export class MaterialSelectModule
{
}