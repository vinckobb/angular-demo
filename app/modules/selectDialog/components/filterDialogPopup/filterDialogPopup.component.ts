import {OnInit, OnDestroy, ChangeDetectorRef, Inject, EventEmitter, ChangeDetectionStrategy, Component, Injector, ViewChild} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {OptionsGatherer, TemplateGatherer, NgSelectOption} from "@anglr/select";
import {DialogPopupContentComponent, DialogPopupOptions, BasicDialogPopupComponent, DialogPopupComponentData} from "@anglr/select/material";
import {Subscription} from "rxjs";
import {FormGroup, FormBuilder} from "@angular/forms";
import {GridOptions, AsyncDataLoaderOptions, SimpleOrdering, DataResponse, Grid, TableContentRendererComponent, TableContentRendererOptions, AdvancedTableBodyContentRendererComponent, AdvancedTableBodyContentRendererOptions} from "@anglr/grid";
import {GridDataService} from "../../../../services/api/gridData/gridData.service";
import {refreshDataToDefaults} from "@anglr/grid/extensions";

@Component(
    {
        selector: 'ng-select-filter-dialog-popup',
        templateUrl: 'filterDialogPopup.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush
    })
export class FilterDialogPopupComponent<TValue> implements DialogPopupContentComponent<TValue>, OnInit, OnDestroy
{
    //######################### private properties #########################

    /**
     * Subscription for available options change
     */
    private _availableOptionsSubscription: Subscription;

    //######################### public properties - template bindings #########################

    /**
     * Array of provided options for select
     */
    public selectOptions: NgSelectOption<TValue>[];

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Gatherer used for obtaining custom templates
     */
    public templateGatherer: TemplateGatherer;

    /**
     * Dialogs popup options
     */
    public options: DialogPopupOptions;

    /**
     * Occurs when user clicks on option, clicked options is passed as argument
     */
    public optionClick: EventEmitter<NgSelectOption<TValue>>;

    /**
     * Filter form
     */
    public form: FormGroup;

    /**
     * Grid options
     */
    public gridOptions: GridOptions;

    //######################### public properties - view children #########################

    /**
     * Grid instance
     */
    @ViewChild('grid')
    public grid: Grid;

    //######################### constructor #########################
    constructor(public dialog: MatDialogRef<BasicDialogPopupComponent<TValue>, DialogPopupComponentData<TValue>>,
                private _changeDetector: ChangeDetectorRef,
                private _formBuilder: FormBuilder,
                private _injector: Injector,
                @Inject(MAT_DIALOG_DATA) public data: DialogPopupComponentData<TValue>)
    {
        if (data)
        {
            this.templateGatherer = data.templateGatherer;
            this.optionsGatherer = data.optionsGatherer;
            this.optionClick = data.optionClick;
            this.options = data.options;
        }

        this.form = this._formBuilder.group(
            {
                filter: ""
            }
        );

        this.gridOptions = 
        {
            plugins:
            {
                dataLoader:
                {
                    options: <AsyncDataLoaderOptions<any, SimpleOrdering>>
                    {
                        dataCallback: this._getData.bind(this)
                    }
                },
                contentRenderer:
                {
                    type: TableContentRendererComponent,
                    options: <TableContentRendererOptions>
                    {
                        plugins:
                        {
                            bodyRenderer:
                            {
                                type: AdvancedTableBodyContentRendererComponent,
                                options: <AdvancedTableBodyContentRendererOptions<any>>
                                {
                                    rowClick: (row: any) =>
                                    {
                                        this.optionClick?.emit(row);
                                    },
                                    rowCssClass: () => 'pointer-cursor'
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if (this.optionsGatherer)
        {
            this.selectOptions = this.optionsGatherer.availableOptions;
            this._availableOptionsSubscription = this.optionsGatherer.availableOptionsChange.subscribe(() => 
            {
                this.selectOptions = this.optionsGatherer.availableOptions;
                this._changeDetector.detectChanges();
            });
        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._availableOptionsSubscription?.unsubscribe();
        this._availableOptionsSubscription = null;
    }

    //######################### public methods #########################

    public filter()
    {
        this.grid.execute(refreshDataToDefaults(true));
    }

    //######################### private methods #########################

    /**
     * Callback used for obtaining data
     * @param  {number} page Index of requested page
     * @param  {number} itemsPerPage Number of items per page
     * @param  {TOrdering} ordering Order by column name
     */
    private async _getData(page: number, itemsPerPage: number, ordering: SimpleOrdering): Promise<DataResponse<any>>
    {
        let result = await this._injector.get(GridDataService)
            .getGridData(
            {
                page: (page - 1),
                size: itemsPerPage
            }).toPromise();

        return {
            data: result.content,
            totalCount: result.totalElements
        };
    }
}