import { Component, EventEmitter, Injectable, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { CaseType, Column, FieldType, Formatters, FormElementType, GraphqlService, GridOption } from 'angular-slickgrid';
import { HttpClient } from '@angular/common/http';

const defaultPageSize = 20;
const sampleDataRoot = '/assets/data';

@Component({
  templateUrl: './grid-graphql.component.html',
  providers: [GraphqlService]
})
@Injectable()
export class GridGraphqlComponent implements OnInit {
  title = 'Example 6: Grid connected to Backend Server with GraphQL';
  subTitle = `
    Sorting/Paging connected to a Backend GraphQL Service (<a href="https://github.com/ghiscoding/Angular-Slickgrid/wiki/GraphQL" target="_blank">Wiki link</a>).
    <br/>
    <ul class="small">
      <li><span class="red">(*) NO DATA SHOWING</span> - just change Filters &amp; Pages and look at the "GraphQL Query" changing :)</li>
      <li>Only "Name" field is sortable for the demo (because we use JSON files), however "multiColumnSort: true" is also supported</li>
      <li>String column also support operator (>, >=, <, <=, <>, !=, =, ==, *)
      <ul>
        <li>The (*) can be used as startsWith (ex.: "abc*" => startsWith "abc") / endsWith (ex.: "*xyz" => endsWith "xyz")</li>
        <li>The other operators can be used on column type number for example: ">=100" (bigger or equal than 100)</li>
      </ul>
    </ul>
  `;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];

  graphqlQuery = '';
  processing = false;
  status = { text: '', class: '' };
  isWithCursor = false;

  constructor(private http: HttpClient, private graphqlService: GraphqlService) {
  }

  ngOnInit(): void {
    this.columnDefinitions = [
      { id: 'name', name: 'Name', field: 'name', filterable: true, sortable: true, type: FieldType.string, minWidth: 100 },
      { id: 'gender', name: 'Gender', field: 'gender', filterable: true, sortable: true, minWidth: 100,
        filter: {
          searchTerm: '', // default selection
          type: FormElementType.select,
          selectOptions: [ { value: '', label: '' }, { value: 'male', label: 'male' }, { value: 'female', label: 'female' } ]
        }
      },
      { id: 'company', name: 'Company', field: 'company', filterable: true },
      { id: 'billing.address.street', name: 'Billing Address Street', field: 'billing.address.street', filterable: true, sortable: true },
      { id: 'billing.address.zip', name: 'Billing Address Zip', field: 'billing.address.zip', filterable: true, sortable: true },
    ];

    this.gridOptions = {
      enableAutoResize: false,
      enableFiltering: true,
      enableCellNavigation: true,
      enablePagination: true,
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: defaultPageSize,
        totalItems: 0
      },
      onBackendEventApi: {
        onInit: (query) => this.getCustomerApiCall(query),
        preProcess: () => this.displaySpinner(true),
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (response) => {
          this.displaySpinner(false);
          this.getCustomerCallback(response);
        },
        filterTypingDebounce: 700,
        service: this.graphqlService
      }
    };

    const paginationOption = this.getPaginationOption(this.isWithCursor);
    this.graphqlService.initOptions(paginationOption);
  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  filterChange() {
    console.log('filter change');
  }

  filterChangeAfter() {
    console.log('after filter change');
    this.displaySpinner(false);
  }

  onWithCursorChange(isWithCursor) {
    this.isWithCursor = isWithCursor;
    const paginationOption = this.getPaginationOption(isWithCursor);
    this.graphqlService.initOptions(paginationOption);
    this.graphqlQuery = this.graphqlService.buildQuery();
  }

  getPaginationOption(isWithCursor: boolean) {
    let paginationOption;
    const columnIds = Array.isArray(this.columnDefinitions) ? this.columnDefinitions.map((column) => column.field) : [];

    // Slickgrid also requires the "id" field
    columnIds.push('id');

    if (isWithCursor) {
      // with cursor, paginationOptions can be: { first, last, after, before }
      paginationOption = {
        datasetName: 'users',
        dataFilters: columnIds,
        isWithCursor: true,
        paginationOptions: {
          first: defaultPageSize
        }
      };
    } else {
      // without cursor, paginationOptions can be: { first, last, offset }
      paginationOption = {
        datasetName: 'users',
        dataFilters: columnIds,
        isWithCursor: false,
        paginationOptions: {
          first: defaultPageSize,
          offset: 0
        }
      };
    }
    return paginationOption;
  }

  getCustomerCallback(data) {
    this.displaySpinner(false);

    this.dataset = data['items'];
    this.graphqlQuery = data['query'];

    // totalItems property needs to be filled for pagination to work correctly
    this.gridOptions.pagination.totalItems = data['totalRecordCount'];
  }

  getCustomerApiCall(query) {
    // in your case, you will call your WebAPI function (wich needs to return a Promise)
    // for the demo purpose, we will call a mock WebAPI function
    return new Promise((resolve, reject) => {
      this.graphqlQuery = this.graphqlService.buildQuery();
      setTimeout(() => {
        resolve({ items: [], totalRecordCount: 100, query: query });
      }, 500);
    });
    // return this.getCustomerDataApiMock(query);
  }

  /** This function is only here to mock a WebAPI call (since we are using a JSON file for the demo)
   *  in your case the getCustomer() should be a WebAPI function returning a Promise
   */
  getCustomerDataApiMock(query) {
    // the mock is returning a Promise, just like a WebAPI typically does
    return new Promise((resolve, reject) => {
      const queryParams = query.toLowerCase().split('&');
      let top: number;
      let skip = 0;
      let orderBy = '';
      let countTotalItems = 100;
      let columnFilters = {};

      for (const param of queryParams) {
        if (param.includes('$top=')) {
          top = +(param.substring('$top='.length));
        }
        if (param.includes('$skip=')) {
          skip = +(param.substring('$skip='.length));
        }
        if (param.includes('$orderby=')) {
          orderBy = param.substring('$orderby='.length);
        }
        if (param.includes('$filter=')) {
          const filterBy = param.substring('$filter='.length);
          if (filterBy.includes('substringof')) {
            const filterMatch = filterBy.match(/substringof\('(.*?)',([a-zA-Z ]*)/);
            const fieldName = filterMatch[2].trim();
            columnFilters[fieldName] = {
              type: 'substring',
              term: filterMatch[1].trim()
            };
          }
          if (filterBy.includes('eq')) {
            const filterMatch = filterBy.match(/([a-zA-Z ]*) eq '(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'equal',
              term: filterMatch[2].trim()
            };
          }
          if (filterBy.includes('startswith')) {
            const filterMatch = filterBy.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'starts',
              term: filterMatch[2].trim()
            };
          }
          if (filterBy.includes('endswith')) {
            const filterMatch = filterBy.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'ends',
              term: filterMatch[2].trim()
            };
          }
        }
      }

      const sort = orderBy.includes('asc')
        ? 'ASC'
        : orderBy.includes('desc')
          ? 'DESC'
          : '';

      let url;
      switch (sort) {
        case 'ASC':
          url = `${sampleDataRoot}/customers_100_ASC.json`;
          break;
        case 'DESC':
          url = `${sampleDataRoot}/customers_100_DESC.json`;
          break;
        default:
          url = `${sampleDataRoot}/customers_100.json`;
          break;
      }

      this.http.get(url).subscribe(data => {
        const dataArray = <any[]> data;

        // Read the result field from the JSON response.
        const firstRow = skip;
        let filteredData = dataArray;
        if (columnFilters) {
          for (const columnId in columnFilters) {
            if (columnFilters.hasOwnProperty(columnId)) {
              filteredData = filteredData.filter(column => {
                const filterType = columnFilters[columnId].type;
                const searchTerm = columnFilters[columnId].term;
                switch (filterType) {
                  case 'equal': return column[columnId] === searchTerm;
                  case 'ends': return column[columnId].toLowerCase().endsWith(searchTerm);
                  case 'starts': return column[columnId].toLowerCase().startsWith(searchTerm);
                  case 'substring': return column[columnId].toLowerCase().includes(searchTerm);
                }
              });
            }
          }
          countTotalItems = filteredData.length;
        }
        const updatedData = filteredData.slice(firstRow, firstRow + top);

        setTimeout(() => {
          resolve({ items: updatedData, totalRecordCount: countTotalItems, query: query });
        }, 500);
      });
    });
  }
}
