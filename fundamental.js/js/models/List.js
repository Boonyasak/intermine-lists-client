(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.List = (function() {

    __extends(List, Backbone.Model);

    function List() {
      this.selectedChanged = __bind(this.selectedChanged, this);
      this.setSelected = __bind(this.setSelected, this);
      List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.defaults = {
      name: "",
      slug: "",
      type: "",
      created: "",
      folder: "",
      selected: false
    };

    List.prototype.initialize = function() {
      var folder;
      folder = void 0;
      _.find(this["attributes"]["tags"], (function(tag) {
        if (tag.substring(0, 7) === "folder/") return folder = tag.substring(7);
      }));
      this.set({
        folder: folder || false
      });
      App.Models.Folders.add(new Folder({
        name: folder,
        lists: [this["attributes"]["name"]],
        topLevel: (folder ? false : true)
      }));
      this.set({
        slug: this.slugify(this.get("name"))
      });
      return this.bind("change:selected", this.selectedChanged);
    };

    List.prototype.slugify = function(text) {
      return text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '').replace(/-/gi, "_").replace(/\s/gi, "-").toLowerCase();
    };

    List.prototype.toggleSelected = function() {
      return this.set({
        selected: !this.get("selected")
      });
    };

    List.prototype.setSelected = function() {
      return this.set({
        selected: true
      });
    };

    List.prototype.selectedChanged = function() {
      return App.Mediator.trigger((this.get("selected") ? "listSelected" : "listDeselected"), this.get("name"));
    };

    return List;

  })();

  window.Lists = (function() {

    __extends(Lists, Backbone.Collection);

    function Lists() {
      Lists.__super__.constructor.apply(this, arguments);
    }

    Lists.prototype.model = List;

    Lists.prototype.selected = function() {
      return this.filter(function(list) {
        return list.get("selected");
      });
    };

    Lists.prototype.deselected = function() {
      return this.filter(function(list) {
        return !list.get("selected");
      });
    };

    Lists.prototype.byName = function(name) {
      return this.find(function(list) {
        return list.get("name") === name;
      });
    };

    Lists.prototype.bySlug = function(slug) {
      return this.find(function(list) {
        return list.get("slug") === slug;
      });
    };

    Lists.prototype.comparator = function(list) {
      return list.get("name");
    };

    return Lists;

  })();

}).call(this);
