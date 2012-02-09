(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  App.Views.SidebarFolderView = (function() {

    __extends(SidebarFolderView, Backbone.View);

    function SidebarFolderView() {
      this.remove = __bind(this.remove, this);
      this.addOneList = __bind(this.addOneList, this);
      SidebarFolderView.__super__.constructor.apply(this, arguments);
    }

    SidebarFolderView.prototype.tagName = "li";

    SidebarFolderView.prototype.template = _.template((function() {
      var result;
      result = "";
      $.ajax({
        async: false,
        url: "js/templates/_sidebar_folder.html",
        success: function(data) {
          return result = data;
        }
      });
      return result;
    })());

    SidebarFolderView.prototype.events = {
      "click a.toggle": "toggleFolder"
    };

    SidebarFolderView.prototype.toggleFolder = function() {
      return $(this.el).toggleClass("active").find("ul").toggleClass("active");
    };

    SidebarFolderView.prototype.initialize = function() {
      this.model.bind("change", this.render, this);
      this.model.bind("destroy", this.remove, this);
      return App.Mediator.bind("filterLists", this.filterLists);
    };

    SidebarFolderView.prototype.addOneList = function(listName) {
      var list;
      list = App.Models.Lists.find(function(list) {
        return list.get("name") === listName;
      });
      return $(this.el).find("ul.lists").append(new App.Views.SidebarListView({
        model: list
      }).render().el);
    };

    SidebarFolderView.prototype.filterLists = function(filter) {
      var listName, re, _i, _len, _ref, _results;
      $(this.el).find("ul.lists").remove();
      re = new RegExp("" + filter + ".*", "i");
      _ref = this.model.get("lists");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listName = _ref[_i];
        if (listName.match(re)) _results.push(this.addOneList(listName));
      }
      return _results;
    };

    SidebarFolderView.prototype.render = function() {
      var folder, name;
      folder = this.model;
      if (folder.get("topLevel")) {
        folder.set({
          expanded: true
        });
      }
      $(this.el).html(this.template(folder.toJSON())).attr("data-view", "SidebarFolderView");
      name = folder.get("name") || "top";
      $(this.el).attr("data-list-name", name);
      _.each(folder.get("lists"), this.addOneList);
      return this;
    };

    SidebarFolderView.prototype.remove = function() {
      return $(this.el).remove();
    };

    SidebarFolderView.prototype.clear = function() {
      return this.model.destroy();
    };

    return SidebarFolderView;

  })();

}).call(this);
