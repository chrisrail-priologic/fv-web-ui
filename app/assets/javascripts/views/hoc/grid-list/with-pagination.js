import React, { Component, PropTypes } from 'react';
import selectn from 'selectn';

import Pagination from 'views/components/Navigation/Pagination';

import {IconButton, MenuItem, SelectField} from "material-ui";

/**
 * HOC: Adds pagination to a grid list
 */
export default function withPagination(ComposedFilter, pageSize = 10, pageRange = 10) {
  class PaginatedGridList extends Component {

    static defaultProps = {
      disablePageSize: false
    }

    static propTypes = {
        fetcher: PropTypes.func.isRequired,
        fetcherParams: PropTypes.object.isRequired,
        metadata: PropTypes.object.isRequired,
        disablePageSize: PropTypes.bool
    }

    constructor(props, context){
      super(props, context);

      this.state = {
          pageRange: pageRange,
          initialPageSize:  selectn('fetcherParams.pageSize', props) || pageSize,
          currentPageSize:  selectn('fetcherParams.pageSize', props) || pageSize,
          currentPageIndex: 0
      };

      ['_onPageChange', '_onPageSizeChange'].forEach( (method => this[method] = this[method].bind(this)) );
    }

    _onPageSizeChange(event, index, value) {

      let currentPageSize = value;

      this.props.fetcher(Object.assign({}, this.props.fetcherParams, {
        currentPageIndex: this.state.currentPageIndex,
        pageSize: currentPageSize
      }));

      this.setState({currentPageSize: currentPageSize});
    }

    _onPageChange(pagination) {

      let currentPageIndex = pagination.selected;

      this.props.fetcher(Object.assign({}, this.props.fetcherParams, {
        currentPageIndex: currentPageIndex,
        pageSize: this.state.currentPageSize
      }));

      this.setState( { currentPageIndex: currentPageIndex });
    }

    render() {

      const ips = this.state.initialPageSize;

      const pageSizeControl = (!this.props.disablePageSize) ? <div>
                <label style={{verticalAlign: '4px', marginRight: '10px'}}>Page:</label>
                <span style={{verticalAlign: '4px'}}>{this.state.currentPageIndex + 1} / </span>
                <SelectField style={{width: '45px', marginRight: '5px'}} value={this.state.currentPageSize} onChange={this._onPageSizeChange}>
                  <MenuItem value={Math.ceil(ips / 2)} primaryText={Math.ceil(ips / 2)} />
                  <MenuItem value={Math.ceil(ips)} primaryText={Math.ceil(ips)} />
                  <MenuItem value={Math.ceil(ips * 2)} primaryText={Math.ceil(ips * 2)} />
                  <MenuItem value={Math.ceil(ips * 3)} primaryText={Math.ceil(ips * 3)} />
                  <MenuItem value={Math.ceil(ips * 4)} primaryText={Math.ceil(ips * 4)} />
                  <MenuItem value={Math.ceil(ips * 5)} primaryText={Math.ceil(ips * 5)} />
                </SelectField>
                <span style={{verticalAlign: '4px'}}>Results: {selectn('resultsCount', this.props.metadata)}</span>
              </div> : '';

      return(
          <div>

            <div className="row">
              <div className="col-xs-12">
                <ComposedFilter
                  {...this.state}
                  {...this.props} />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-9">
                <Pagination 
                  forcePage={this.props.fetcherParams.currentPageIndex}
                  pageCount={selectn('pageCount', this.props.metadata)}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={this.state.pageRange}
                  onPageChange={this._onPageChange} />
              </div>

              <div className="col-xs-3" style={{textAlign:'right'}}>
                {pageSizeControl}
                {this.props.appendControls}
              </div>


            </div>

          </div>)
      ;
    }
  }

  return PaginatedGridList;
}