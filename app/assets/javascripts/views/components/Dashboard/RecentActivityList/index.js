/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, {Component} from 'react';
import provide from 'react-redux-provide';
import selectn from 'selectn';

export default class RecentActivityList extends Component {

  constructor(props, context) {
    super(props, context);
  }
  
  // Convert timestamps in the format "2016-05-19T16:56:27.43Z" to "2016-05-19 16:56:27"
  _formatDate(date) {
	  const dateString = date.slice(0, 10);
	  const timeString = date.slice(11, 19);
	  return dateString + " " + timeString;
  }

  // Convert Nuxeo paths to webui links
  _formatLink(path, docType) {
	  
	  switch(docType) {
	  	case "word":
	  		path = path.replace("/Dictionary/", "/learn/words/");
	  		return "/explore" + path;
	  	break;
	  	
	  	case "phrase":
	  		path = path.replace("/Dictionary/", "/learn/phrases/");
	  		return "/explore" + path;
	  	break;

	  	case "song":
	  		path = path.replace("/Stories & Songs/", "/learn/songs/");
	  		return "/explore" + path;
	  	break;
	  		
	  	case "story":
	  		path = path.replace("/Stories & Songs/", "/learn/stories/");
	  		return "/explore" + path;
	  	break;	  			  		
	  }
  } 
  
  render() {

    if(this.props.data == undefined || this.props.data.entries == undefined || this.props.data.entries.length == 0) {
		return <div></div>;	
    }	  
	  
    return (
    	<div>
        	<h3 style={{margin: '0', padding: '10px 0', fontSize: '1.2em'}}>{this.props.title}</h3>
        	<ul>
				{this.props.data.entries.map((document, i) => 
				<li style={{padding: '0 0 5px 0'}} key={document['uid']}><a href={this._formatLink(document['path'], this.props.docType)}>{document['title']}</a> <br />
    				{this._formatDate(document.properties['dc:modified'])} {(document.properties['dc:lastContributor'].indexOf("Administrator") != -1) ? '' : <span>by <strong>{document.properties['dc:lastContributor']}</strong></span>}
				</li>
	    	)}
			</ul>        	
		</div>
    );
  }
}