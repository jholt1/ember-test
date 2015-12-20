"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('world-clock/adapters/application', ['exports', 'ember-localforage-adapter/adapters/localforage'], function (exports, _emberLocalforageAdapterAdaptersLocalforage) {
    exports['default'] = _emberLocalforageAdapterAdaptersLocalforage['default'].extend({
        namespace: 'WorldTimeZones'
    });
});
define('world-clock/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'world-clock/config/environment'], function (exports, _ember, _emberResolver, _emberLoadInitializers, _worldClockConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _worldClockConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _worldClockConfigEnvironment['default'].podModulePrefix,
    Resolver: _emberResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _worldClockConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('world-clock/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'world-clock/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _worldClockConfigEnvironment) {

  var name = _worldClockConfigEnvironment['default'].APP.name;
  var version = _worldClockConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('world-clock/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('world-clock/controllers/clock', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        init: function init() {
            // Update the time.
            this.updateTime();
        },

        updateTime: function updateTime() {
            var _this = this;

            // Update the time every second.
            _ember['default'].run.later(function () {
                _this.set('localTime', moment().format('h:mm:ss a'));

                _this.get('model').forEach(function (model) {
                    model.set('time', moment().tz(model.get('name')).format('h:mm:ss a'));
                });

                _this.updateTime();
            }, 1000);
        },

        localTime: moment().format('h:mm:ss a')
    });
});
define('world-clock/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('world-clock/controllers/timezones', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    /* create array of timezones with name & offset */
    init: function init() {
      var timezones = [];
      for (var i in moment.tz._zones) {
        timezones.push({
          name: moment.tz._zones[i].name,
          offset: moment.tz._zones[i].offsets[0]
        });
      }
      this.set('timezones', timezones);
      this._super();
    },
    selectedTimezone: null,
    actions: {
      /* save a timezone record to our offline datastore */
      add: function add() {
        var timezone = this.store.createRecord('timezone', {
          name: this.get('selectedTimezone').name,
          offset: this.get('selectedTimezone').offset
        });
        timezone.save();
      },
      /* delete a timezone record from our offline datastore */
      remove: function remove(timezone) {
        timezone.destroyRecord();
      }
    }
  });
});
define('world-clock/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'world-clock/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _worldClockConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_worldClockConfigEnvironment['default'].APP.name, _worldClockConfigEnvironment['default'].APP.version)
  };
});
define('world-clock/initializers/export-application-global', ['exports', 'ember', 'world-clock/config/environment'], function (exports, _ember, _worldClockConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_worldClockConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _worldClockConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_worldClockConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('world-clock/models/timezone', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        offset: _emberData['default'].attr('number')
    });
});
define('world-clock/router', ['exports', 'ember', 'world-clock/config/environment'], function (exports, _ember, _worldClockConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _worldClockConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('clock');
    this.route('timezones');
  });

  exports['default'] = Router;
});
define('world-clock/routes/application', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        redirect: function redirect() {
            this.transitionTo('clock');
        }
    });
});
define('world-clock/routes/clock', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        model: function model() {
            return this.get('store').find('timezone');
        }
    });
});
define('world-clock/routes/timezones', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        model: function model() {
            return this.get('store').findAll('timezone');
        }
    });
});
define('world-clock/serializers/localforage', ['exports', 'ember-localforage-adapter/serializers/localforage'], function (exports, _emberLocalforageAdapterSerializersLocalforage) {
  exports['default'] = _emberLocalforageAdapterSerializersLocalforage['default'];
});
define("world-clock/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.11",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 8
            },
            "end": {
              "line": 4,
              "column": 33
            }
          },
          "moduleName": "world-clock/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Clock");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.11",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 8
            },
            "end": {
              "line": 5,
              "column": 48
            }
          },
          "moduleName": "world-clock/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Manage Timezones");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.11",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 10
          }
        },
        "moduleName": "world-clock/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        dom.setAttribute(el1, "id", "title");
        var el2 = dom.createTextNode("It's 5'o'clock somewhere");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "link-to", ["clock"], [], 0, null, ["loc", [null, [4, 8], [4, 45]]]], ["block", "link-to", ["timezones"], [], 1, null, ["loc", [null, [5, 8], [5, 60]]]], ["content", "outlet", ["loc", [null, [9, 0], [9, 10]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("world-clock/templates/clock", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.11",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 2
            },
            "end": {
              "line": 6,
              "column": 2
            }
          },
          "moduleName": "world-clock/templates/clock.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(": ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(element0, 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [2]), 0, 0);
          return morphs;
        },
        statements: [["content", "name", ["loc", [null, [5, 8], [5, 16]]]], ["content", "time", ["loc", [null, [5, 26], [5, 34]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.11",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 5
          }
        },
        "moduleName": "world-clock/templates/clock.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Local Time: ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("strong");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n \n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]), 1, 1);
        return morphs;
      },
      statements: [["content", "localTime", ["loc", [null, [1, 24], [1, 37]]]], ["block", "each", [["get", "model", ["loc", [null, [4, 10], [4, 15]]]]], [], 0, null, ["loc", [null, [4, 2], [6, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("world-clock/templates/timezones", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.11",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 0
            },
            "end": {
              "line": 13,
              "column": 0
            }
          },
          "moduleName": "world-clock/templates/timezones.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          var el3 = dom.createTextNode("Delete");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [2]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(element0, 0, 0);
          morphs[1] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [["content", "name", ["loc", [null, [12, 6], [12, 14]]]], ["element", "action", ["remove", ["get", "this", ["loc", [null, [12, 41], [12, 45]]]]], [], ["loc", [null, [12, 23], [12, 47]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.11",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 5
          }
        },
        "moduleName": "world-clock/templates/timezones.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Add Timezone");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("button");
        var el2 = dom.createTextNode("Add Timezone");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("My Timezones");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [4]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2]), 0, 0);
        morphs[1] = dom.createElementMorph(element2);
        morphs[2] = dom.createMorphAt(dom.childAt(fragment, [8]), 1, 1);
        return morphs;
      },
      statements: [["inline", "view", [["get", "Ember.Select", ["loc", [null, [3, 13], [3, 25]]]]], ["content", ["subexpr", "@mut", [["get", "timezones", ["loc", [null, [3, 34], [3, 43]]]]], [], []], "selection", ["subexpr", "@mut", [["get", "selectedTimezone", ["loc", [null, [3, 54], [3, 70]]]]], [], []], "optionValuePath", "content.offset", "optionLabelPath", "content.name"], ["loc", [null, [3, 5], [4, 68]]]], ["element", "action", ["add"], [], ["loc", [null, [6, 8], [6, 24]]]], ["block", "each", [["get", "model", ["loc", [null, [11, 8], [11, 13]]]]], [], 0, null, ["loc", [null, [11, 0], [13, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('world-clock/config/environment', ['ember'], function(Ember) {
  var prefix = 'world-clock';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (!runningTests) {
  require("world-clock/app")["default"].create({"name":"world-clock","version":"0.0.0+aa57254c"});
}

/* jshint ignore:end */
//# sourceMappingURL=world-clock.map