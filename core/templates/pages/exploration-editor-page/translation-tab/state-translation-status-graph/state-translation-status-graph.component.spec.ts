// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for stateTranslationStatusGraph.
 */

import { TestBed } from '@angular/core/testing';
import { StateEditorService } from
  // eslint-disable-next-line max-len
  'components/state-editor/state-editor-properties-services/state-editor.service';
import { StateRecordedVoiceoversService } from
  // eslint-disable-next-line max-len
  'components/state-editor/state-editor-properties-services/state-recorded-voiceovers.service';
import { StateWrittenTranslationsService } from
  // eslint-disable-next-line max-len
  'components/state-editor/state-editor-properties-services/state-written-translations.service';
import { AlertsService } from 'services/alerts.service';
import { UtilsService } from 'services/utils.service';

describe('State Translation Status Graph Component', function() {
  var $rootScope = null;
  var $scope = null;
  var explorationStatesService = null;
  var graphDataService = null;
  var stateEditorService = null;
  var stateRecordedVoiceoversService = null;
  var stateWrittenTranslationsService = null;
  var translationStatusService = null;

  var stateName = 'State1';
  var state = {
    recorded_voiceovers: {},
    written_translations: {}
  };

  beforeEach(angular.mock.module('oppia', function($provide) {
    $provide.value('AlertsService', TestBed.get(AlertsService));
    $provide.value(
      'StateRecordedVoiceoversService',
      TestBed.get(StateRecordedVoiceoversService));
    $provide.value(
      'StateWrittenTranslationsService',
      TestBed.get(StateWrittenTranslationsService));
    $provide.value('UtilsService', TestBed.get(UtilsService));
  }));

  beforeEach(function() {
    stateEditorService = TestBed.get(StateEditorService);
    stateRecordedVoiceoversService = TestBed.get(
      StateRecordedVoiceoversService);
    stateWrittenTranslationsService = TestBed.get(
      StateWrittenTranslationsService);
  });

  describe('when translation tab is not busy', function() {
    beforeEach(angular.mock.inject(function($injector, $componentController) {
      $rootScope = $injector.get('$rootScope');
      explorationStatesService = $injector.get('ExplorationStatesService');
      graphDataService = $injector.get('GraphDataService');
      translationStatusService = $injector.get('TranslationStatusService');

      spyOn(stateEditorService, 'getActiveStateName').and.returnValue(
        stateName);
      spyOn(explorationStatesService, 'getState').and.returnValue(state);

      $scope = $rootScope.$new();
      $componentController('stateTranslationStatusGraph', {
        $scope: $scope,
        StateEditorService: stateEditorService,
        StateRecordedVoiceoversService: stateRecordedVoiceoversService,
        StateWrittenTranslationsService: stateWrittenTranslationsService
      }, {
        isTranslationTabBusy: false
      });
    }));

    it('should get graph data from graph data service', function() {
      var graphData = {
        finalStateIds: [],
        initStateId: 'property_1',
        links: [],
        nodes: {}
      };
      spyOn(graphDataService, 'getGraphData').and.returnValue(graphData);

      expect($scope.getGraphData()).toEqual(graphData);
      expect(graphDataService.getGraphData).toHaveBeenCalled();
    });

    it('should get node colors from translation status', function() {
      var nodeColors = {};
      spyOn(translationStatusService, 'getAllStateStatusColors').and
        .returnValue(nodeColors);

      expect($scope.nodeColors()).toEqual(nodeColors);
      expect(translationStatusService.getAllStateStatusColors)
        .toHaveBeenCalled();
    });

    it('should get active state name from state editor', function() {
      expect($scope.getActiveStateName()).toBe(stateName);
    });

    it('should set new active state name and refresh state when clicking' +
      ' on state in map', function() {
      var broadcastSpy = spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(stateEditorService, 'setActiveStateName');
      $scope.onClickStateInMap('State2');

      expect(stateEditorService.setActiveStateName).toHaveBeenCalledWith(
        'State2');
      expect(broadcastSpy).toHaveBeenCalledWith('refreshStateTranslation');
    });
  });

  describe('when translation tab is busy', function() {
    beforeEach(angular.mock.inject(function($injector, $componentController) {
      $rootScope = $injector.get('$rootScope');
      explorationStatesService = $injector.get('ExplorationStatesService');
      graphDataService = $injector.get('GraphDataService');
      translationStatusService = $injector.get('TranslationStatusService');

      $scope = $rootScope.$new();
      $scope.isTranslationTabBusy = true;
      $componentController('stateTranslationStatusGraph', {
        $scope: $scope,
        StateEditorService: stateEditorService,
        StateRecordedVoiceoversService: stateRecordedVoiceoversService,
        StateWrittenTranslationsService: stateWrittenTranslationsService
      }, {
        isTranslationTabBusy: true
      });
    }));

    it('should show translation tab busy modal', function() {
      var broadcastSpy = spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(stateEditorService, 'setActiveStateName');
      $scope.onClickStateInMap('State2');

      expect(stateEditorService.setActiveStateName).not.toHaveBeenCalled();
      expect(broadcastSpy).toHaveBeenCalledWith('showTranslationTabBusyModal');
    });
  });
});
