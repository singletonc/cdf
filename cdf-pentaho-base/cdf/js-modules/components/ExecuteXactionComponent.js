/*!
 * Copyright 2002 - 2014 Webdetails, a Pentaho company.  All rights reserved.
 *
 * This software was developed by Webdetails and is provided under the terms
 * of the Mozilla Public License, Version 2.0, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to  http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
 * the license for the specific language governing your rights and limitations.
 */

define(['../wd', '../lib/jquery', './BaseComponent', '../lib/jquery.fancybox'],
  function(wd, $, BaseComponent) {

  var ExecuteXactionComponent = BaseComponent.extend({
    visible: false,
    update: function() {
      // 2 modes of working; if it's a div, create a button inside it
      var myself = this;
      var o = $("#" + this.htmlObject);
      if($.inArray(o[0].tagName.toUpperCase(), ["SPAN", "DIV"]) > -1) {
        // create a button
        o = $("<button/>").appendTo(o.empty());
        if(o[0].tagName == "DIV") {
          o.wrap("<span/>");
        }
        if(this.label != undefined) {
          o.text(this.label);
        }
        o.button();
      }
      o.unbind("click"); // Needed to avoid multiple binds due to multiple updates(ex:component with listeners)
      o.bind("click", function() {
        var success = typeof (myself.preChange) == 'undefined' ? true : myself.preChange();
        if (success) {
          myself.executeXAction();
        }
        typeof (myself.postChange) == 'undefined' ? true : myself.postChange();
      });
    },
    executeXAction: function() {
      var url = wd.cdf.endpoints.getCdfXaction(this.path, this.action, this.solution) + "&";
      var p = new Array(this.parameters.length);
      var parameters = [];
      for(var i = 0, len = p.length; i < len; i++) {
        var key = this.parameters[i][0];
        var value = this.dashboard.getParameterValue(this.parameters[i][1]);
        if($.isArray(value)) {
          $(value).each(function(p) {
            parameters.push(key + "=" + encodeURIComponent(this));
          });
        } else {
          parameters.push(key + "=" + encodeURIComponent(value));
        }
      }
      url += parameters.join("&");
      var _href = url.replace(/'/g, "&#39;");
      $.fancybox({
        type: "iframe",
        href: _href,
        width: $(window).width(),
        height: $(window).height() - 50
      });
    }
  });

  return ExecuteXactionComponent;

});