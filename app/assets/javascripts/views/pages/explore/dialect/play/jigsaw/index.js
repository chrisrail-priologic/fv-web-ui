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
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Immutable, { List, Map } from 'immutable';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';

import Game from './wrapper'

/**
* Play games
*/
@provide
export default class Jigsaw extends Component {

  static propTypes = {
    fetchResources: PropTypes.func.isRequired,
    computeResources: PropTypes.object.isRequired,
    fetchWords: PropTypes.func.isRequired,
    computeWords: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired
  }

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context);
  }

  /**
   * componentDidMount
   */
  componentDidMount () {
    this.fetchData(this.props);
  }

  fetchData(props, pageIndex, pageSize, sortOrder, sortBy) {
    props.fetchWords(props.routeParams.dialect_path + '/Dictionary',
    ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv:related_pictures', this.props.routeParams.area) +'/* IS NOT NULL' + 
    ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) +'/* IS NOT NULL' + 
    //' AND fv-word:available_in_games = 1' + 
    '&currentPageIndex=' + StringHelpers.randomIntBetween(0, 10) + 
    '&pageSize=25' + 
    '&sortBy=dc:created' + 
    '&sortOrder=DESC' 
    );
  }

  /**
   * Render
   */
  render() {

    let game = '';

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path + '/Dictionary',
      'entity': this.props.computeWords
    }])

    const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this.props.routeParams.dialect_path + '/Dictionary');

    let words = (selectn('response.entries', computeWords) || []).map(function(word, k) {
      return {
          word: selectn('properties.dc:title', word),
          translation: selectn('properties.fv:literal_translation[0].translation', word) || selectn('properties.fv:definitions[0].translation', word),
          audio: ConfGlobal.baseURL + selectn('contextParameters.word.related_audio[0].path', word) + '?inline=true',
          picture: ConfGlobal.baseURL + selectn('contextParameters.word.related_pictures[0].path', word) + '?inline=true'
      };
    })

    if (selectn('success', computeWords)) {

      // If no words found, use placeholders.
      if (words.length == 0) {
        words = [{
          word: 'Bear',
          translation: 'Bear',
          audio: '/assets/games/jigsaw/assets/sounds/sample.mp3',
          picture: '/assets/games/jigsaw/assets/images/picture1.jpg'
        },
        {
          word: 'Totem',
          translation: 'Totem',
          audio: '/assets/games/jigsaw/assets/sounds/sample.mp3',
          picture: '/assets/games/jigsaw/assets/images/picture2.jpg'
        },
        {
          word: 'Fish',
          translation: 'Fish',
          audio: '/assets/games/jigsaw/assets/sounds/sample.mp3',
          picture: '/assets/games/jigsaw/assets/images/picture3.jpg'
        },
        {
          word: 'Fire',
          translation: 'Fire',
          audio: '/assets/games/jigsaw/assets/sounds/sample.mp3',
          picture: '/assets/games/jigsaw/assets/images/picture4.jpg'
        }]
      }

      game = <Game words={words} />;
    }

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
            <div className="row">
              <div className="col-xs-12" style={{textAlign: 'center'}}>
                {game}
                <small>Archive contains {selectn('response.resultsCount', computeWords)} words that met game requirements.</small>
              </div>
            </div>
        </PromiseWrapper>;
  }
}