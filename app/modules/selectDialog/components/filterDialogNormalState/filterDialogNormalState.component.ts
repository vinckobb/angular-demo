import {Component, ChangeDetectionStrategy} from '@angular/core';

import {BasicNormalStateComponent} from '@anglr/select';

/**
 * Component used for rendering filter dialog normal state of select
 */
@Component(
{
    selector: "div.filter-dialog-normal-state",
    templateUrl: 'filterDialogNormalState.component.html',
    styleUrls: ['filterDialogNormalState.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterDialogNormalStateComponent extends BasicNormalStateComponent
{
}