import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {ModuleRoutes} from '@anglr/common/router';
import {DialogPopupModule} from '@anglr/select/material';

import {sampleComponents} from './samples.component.routes';
import {CommonSharedModule} from "../../boot/commonShared.module";
import {TypeaheadTagsSourceDirective, TypeaheadSourceDirective} from "../../components/directives/taSources";
import {SampleDialogComponent} from './dialog/sampleDialog.component';

@NgModule(
{
    declarations: [TypeaheadSourceDirective, TypeaheadTagsSourceDirective, SampleDialogComponent, ...sampleComponents],
    imports:
    [
        CommonSharedModule,
        MatDialogModule,
        DialogPopupModule
    ]
})
@ModuleRoutes(sampleComponents)
export class SamplesModule
{
}
