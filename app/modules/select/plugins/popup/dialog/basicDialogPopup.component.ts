import {Component, ChangeDetectionStrategy, Inject} from "@angular/core";
import {DialogPopupContentComponent, DialogPopupComponentData} from "./dialogPopup.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component(
{
    selector: 'ng-select-basic-dialog-popup',
    templateUrl: 'basicDialogPopup.component.html',
    styleUrls: ['basicDialogPopup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicDialogPopupComponent implements DialogPopupContentComponent<any>
{
    selectOptions: any;

    templateGatherer: any;

    optionClick: any;

    //######################### constructor #########################
    constructor(public dialog: MatDialogRef<BasicDialogPopupComponent, DialogPopupComponentData<any>>,
        @Inject(MAT_DIALOG_DATA) public data: DialogPopupComponentData<any>)
    {
        this.selectOptions = data.options;
        this.templateGatherer = data.templateGatherer;
        this.optionClick = data.optionClick;

        console.log(this.selectOptions);
    }
}