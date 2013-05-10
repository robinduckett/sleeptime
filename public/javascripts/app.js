(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  var Application, Chaplin, routes, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  routes = require('routes');

  module.exports = Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      _ref = Application.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Application.prototype.title = 'Brunch example application';

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      this.initRouter(routes, {
        pushState: true,
        root: '/sleeptime'
      });
      this.initDispatcher({
        controllerSuffix: '-controller'
      });
      this.initLayout();
      this.initComposer();
      this.initMediator();
      this.startRouting();
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initMediator = function() {
      return Chaplin.mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
});
window.require.register("controllers/base/controller", function(exports, require, module) {
  var Chaplin, Controller, HeaderView, SiteView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  SiteView = require('views/site-view');

  HeaderView = require('views/header-view');

  module.exports = Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Controller.prototype.beforeAction = function() {
      this.compose('site', SiteView);
      return this.compose('header', HeaderView);
    };

    return Controller;

  })(Chaplin.Controller);
  
});
window.require.register("controllers/home-controller", function(exports, require, module) {
  var Controller, HomeController, HomePageView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  HomePageView = require('views/home-page-view');

  module.exports = HomeController = (function(_super) {
    __extends(HomeController, _super);

    function HomeController() {
      this._updateTimes = __bind(this._updateTimes, this);    _ref = HomeController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomeController.prototype.index = function() {
      var _this = this;

      (function(a, b, c) {
        var d, e, f;

        if (c in b && b[c]) {
          d = void 0;
          e = a.location;
          f = /^(a|html)$/i;
          return a.addEventListener("click", (function(a) {
            d = a.target;
            while (!f.test(d.nodeName)) {
              d = d.parentNode;
            }
            return "href" in d && (d.href.indexOf("http") || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href);
          }), !1);
        }
      })(document, window.navigator, "standalone");
      window.addEventListener("load", function() {
        return setTimeout((function() {
          return window.scrollTo(0, 1);
        }), 0);
      });
      setInterval((function() {
        return _this._updateTimes();
      }), 1000);
      this.view = new HomePageView({
        region: 'main'
      });
      this._updateTimes();
      $('#time').val(moment().format('HH:mm:ss'));
      $('#time').change(function() {
        return _this._updateTimes(moment().format('YYYY-MM-DD ') + $('#time').val());
      });
      return $('#bedtime-button').click(function() {
        _this._updateTimes(moment().format('YYYY-MM-DD ') + $('#time').val());
        return $('#bedtime').toggle();
      });
    };

    HomeController.prototype._updateTimes = function(time) {
      var key, less, num, pos, times, value, _i, _results;

      pos = '';
      times = {
        now: moment(time)
      };
      if (typeof time !== "undefined") {
        pos = 'bottom';
      }
      for (num = _i = 1; _i <= 6; num = ++_i) {
        if (num === 1) {
          times["" + pos + "slot" + num] = moment(times.now).add('minutes', 90);
          times["" + pos + "slot" + num].add('minutes', 14);
        } else {
          less = num - 1;
          times["" + pos + "slot" + num] = moment(times["" + pos + "slot" + less]).add('minutes', 90);
        }
      }
      _results = [];
      for (key in times) {
        value = times[key];
        if (key !== 'now' || typeof time === "undefined") {
          _results.push($("." + key).html(value.format('h:mm:ss a')));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return HomeController;

  })(Controller);
  
});
window.require.register("initialize", function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    return (new Application).initialize();
  });
  
});
window.require.register("lib/support", function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
});
window.require.register("lib/utils", function(exports, require, module) {
  var Chaplin, utils;

  Chaplin = require('chaplin');

  utils = Chaplin.utils.beget(Chaplin.utils);

  module.exports = utils;
  
});
window.require.register("lib/view-helper", function(exports, require, module) {
  var Chaplin,
    __slice = [].slice;

  Chaplin = require('chaplin');

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;

    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('url', function() {
    var options, params, routeName, _i;

    routeName = arguments[0], params = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
    return Chaplin.helpers.reverse(routeName, params);
  });
  
});
window.require.register("models/base/collection", function(exports, require, module) {
  var Chaplin, Collection, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  Model = require('models/base/model');

  module.exports = Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      _ref = Collection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Collection.prototype.model = Model;

    return Collection;

  })(Chaplin.Collection);
  
});
window.require.register("models/base/model", function(exports, require, module) {
  var Chaplin, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      _ref = Model.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Model;

  })(Chaplin.Model);
  
});
window.require.register("routes", function(exports, require, module) {
  module.exports = function(match) {
    return match('', 'home#index');
  };
  
});
window.require.register("views/base/collection-view", function(exports, require, module) {
  var Chaplin, CollectionView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      _ref = CollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
});
window.require.register("views/base/view", function(exports, require, module) {
  var Chaplin, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view-helper');

  module.exports = View = (function(_super) {
    __extends(View, _super);

    function View() {
      _ref = View.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(Chaplin.View);
  
});
window.require.register("views/header-view", function(exports, require, module) {
  var HeaderView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/header');

  module.exports = HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      _ref = HeaderView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.className = 'header';

    HeaderView.prototype.region = 'header';

    HeaderView.prototype.id = 'header';

    HeaderView.prototype.template = template;

    return HeaderView;

  })(View);
  
});
window.require.register("views/home-page-view", function(exports, require, module) {
  var HomePageView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/home');

  View = require('views/base/view');

  module.exports = HomePageView = (function(_super) {
    __extends(HomePageView, _super);

    function HomePageView() {
      _ref = HomePageView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomePageView.prototype.autoRender = true;

    HomePageView.prototype.className = 'home-page';

    HomePageView.prototype.template = template;

    return HomePageView;

  })(View);
  
});
window.require.register("views/site-view", function(exports, require, module) {
  var SiteView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/site');

  module.exports = SiteView = (function(_super) {
    __extends(SiteView, _super);

    function SiteView() {
      _ref = SiteView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SiteView.prototype.container = 'body';

    SiteView.prototype.id = 'site-container';

    SiteView.prototype.regions = {
      '#header-container': 'header',
      '#page-container': 'main'
    };

    SiteView.prototype.template = template;

    return SiteView;

  })(View);
  
});
window.require.register("views/templates/header", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<h1>Sleep Time</h1>";
    });
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"row-fluid\">\n	<div class=\"span12\">\n		<h5 style=\"text-align: center\">\n			The time now is <strong class=\"now\"></strong>\n		</h5>\n		<h5 style=\"text-align: center\">\n			It takes <strong>fourteen minutes</strong> to fall asleep on average. You should try to wake up at one of the following times:\n		</h5>\n		<h5 style=\"text-align: center\" id=\"times\">\n			<strong class=\"slot1\"></strong> or\n			<strong class=\"slot2\"></strong> or\n			<strong class=\"slot3\"></strong> or\n			<strong class=\"slot4\"></strong> or\n			<strong class=\"slot5\"></strong> or\n			<strong class=\"slot6\"></strong>\n		</h5>\n	</div>\n</div>\n\n<div class=\"row-fluid\" id=\"button\">\n	<div class=\"span12\">\n		<button id=\"bedtime-button\" class=\"btn btn-success\">I know my bed time</button>\n	</div>\n</div>\n\n<div class=\"row-fluid\" id=\"bedtime\">\n	<div class=\"span12\">\n		<h5>I want to go to bed at this time</h5>\n		<input id=\"time\" type=\"time\"></input>\n		<h5>Okay! Aim to go to bed for one of the following times.</h5>\n		<h5 style=\"text-align: center\" id=\"bottomtimes\">\n			<strong class=\"bottomslot1\"></strong> or\n			<strong class=\"bottomslot2\"></strong> or\n			<strong class=\"bottomslot3\"></strong> or\n			<strong class=\"bottomslot4\"></strong> or\n			<strong class=\"bottomslot5\"></strong> or\n			<strong class=\"bottomslot6\"></strong>\n		</h5>\n	</div>\n</div>";
    });
});
window.require.register("views/templates/site", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<header class=\"header-container\" id=\"header-container\"></header>\n\n<div class=\"container-fluid outer-container\">\n  <div class=\"page-container\" id=\"page-container\">\n  </div>\n</div>\n";
    });
});
