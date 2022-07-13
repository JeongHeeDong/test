;(function (Q, $) {
//PopupMenu
  function showDivAt(div, x, y) {
    var body = document.documentElement;
    var bounds = new Q.Rect(window.pageXOffset, window.pageYOffset, body.clientWidth - 2, body.clientHeight - 2);
    var width = div.offsetWidth;
    var height = div.offsetHeight;

    if (x + width > bounds.x + bounds.width) {
      x = bounds.x + bounds.width - width;
    }
    if (y + height > bounds.y + bounds.height) {
      y = bounds.y + bounds.height - height;
    }
    if (x < bounds.x) {
      x = bounds.x;
    }
    if (y < bounds.y) {
      y = bounds.y;
    }
    div.style.left = x + 'px';
    div.style.top = y + 'px';
  }

  function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  var PopupMenu = function (items) {
    this.items = items || [];
  }
  var menuClassName = 'dropdown-menu';
  PopupMenu.Separator = 'divider';

  PopupMenu.prototype = {
    dom: null,
    _invalidateFlag: true,
    add: function (item) {
      this.items.push(item);
      this._invalidateFlag = true;
    },
    addSeparator: function () {
      this.add(PopupMenu.Separator);
    },
    showAt: function (x, y) {
      if (!this.items || !this.items.length) {
        return false;
      }
      if (this._invalidateFlag) {
        this.render();
      }
      this.dom.style.display = "block";
      document.body.appendChild(this.dom);
      showDivAt(this.dom, x, y);
    },
    hide: function () {
      if (this.dom && this.dom.parentNode) {
        this.dom.parentNode.removeChild(this.dom);
      }
    },

    render: function () {
      this._invalidateFlag = false;
      if (!this.dom) {
        this.dom = document.createElement('ul');
        this.dom.setAttribute("role", "menu");
        //this.dom.className = 'mu-popup-menu mu-popup-group';
        this.dom.className = menuClassName;
        var startEventName = Q.isTouchSupport ? "touchstart" : "mousedown";

        if (!this.stopEditWhenClickOnWindow) {
          var _this = this;
          this.stopEditWhenClickOnWindow = function (evt) {
            if (isDescendant(_this.html, evt.target)) {
              _this.hide();
            }
          }
        }
        window.addEventListener("mousedown", this.stopEditWhenClickOnWindow, true);
        this.dom.addEventListener(startEventName, function (evt) {
          Q.stopEvent(evt);
        }, false);
      } else {
        this.dom.innerHTML = "";
      }
      for (var i = 0, l = this.items.length; i < l; i++) {
        var item = this.renderItem(this.items[i]);
        this.dom.appendChild(item);
      }
    },
    html2Escape: function (sHtml) {
      return sHtml.replace(/[<>&"]/g, function (c) {
        return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'}[c];
      });
    },
    renderItem: function (menuItem, zIndex) {
      var dom = document.createElement('li');
      dom.setAttribute("role", "presentation");
      if (menuItem == PopupMenu.Separator) {
        //dom.className = 'mu-divider';
    	dom.className = PopupMenu.Separator;
        dom.innerHTML = " ";
        return dom;
      }
      if (Q.isString(menuItem)) {
        dom.innerHTML = '<a role="menuitem" tabindex="-1" href="#">' + this.html2Escape(menuItem) + '</a>';
        return dom;
      }
      if (menuItem.selected) {
        dom.style.backgroundPosition = '3px 5px';
        dom.style.backgroundRepeat = 'no-repeat';
        dom.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4y2P4//8/AyWYYdQA7AYAAZuamlo7ED+H4naQGNEGQDX/R8PtpBjwHIsBz+lqAGVeoDgQR1MiaRgAnxW7Q0QEK0cAAAAASUVORK5CYII=')";
      }
      var a = document.createElement("a");
      a.setAttribute("role", "menuitem");
      a.setAttribute("tabindex", "-1");
      a.setAttribute("href", "javascript:void(0)");
      dom.appendChild(a);

      if (menuItem.html) {
        a.innerHTML = menuItem.html;
      } else {
        var text = menuItem.text || menuItem.name;
        if (text) {
          a.innerHTML = this.html2Escape(text);
        }
      }
      var className = menuItem.className;
      if (className) {
        dom.className = className;
      }
      var call = menuItem.action;
      var self = this;

      var onclick = function (evt) {
        if (call) {
          call.call(menuItem.scope, evt, menuItem);
        }
        if (!Q.isIOS) {
          evt.target.focus();
        }
        setTimeout(function () {
          self.hide();
        }, 100);
      };
      if (Q.isTouchSupport) {
//            dom.ontouchstart = onclick;
        a.ontouchstart = onclick;
      } else {
        dom.onclick = onclick;
      }
      return dom;
    },
    getMenuItems: function(graph, dataObj, evt){
      var items = [];
      if (dataObj) {
        var isShapeNode = dataObj instanceof Q.ShapeNode;
        var isNode = !isShapeNode && dataObj instanceof Q.Node;

        if ( isNode && !(dataObj.image.indexOf("bg_") >= 0) ) {
          //응용 시스템, 스위치: TREND가 없음
          //스위치: 스위치 포트 상태 팝업
          if(dataObj.image.startsWith("mme") || dataObj.image.startsWith("pgw") || dataObj.image.startsWith("sgw")
              || dataObj.image.startsWith("hss")|| dataObj.image.startsWith("pcrf")
              || dataObj.image.startsWith("du") || dataObj.image.startsWith("ru") ) {
            items.push({
              text: 'Trend',
              action: function(evt, item) {
                nwtDetail.goTrend(dataObj);
              }
            });
          }

          //스위치 - Trend가 아닌 다른 메뉴
          if( dataObj.image.startsWith("l2") || dataObj.image.startsWith("l3") ) {
            items.push({
              text: '스위치',
              action: function(evt, item) {
                nwtDetail.goSwitch(dataObj);
              }
            });
          }

        if(dataObj.image.startsWith("mme") || dataObj.image.startsWith("pgw") || dataObj.image.startsWith("sgw")
            || dataObj.image.startsWith("hss")|| dataObj.image.startsWith("pcrf")
            || dataObj.image.startsWith("du") || dataObj.image.startsWith("ru") ) {
          items.push({
            text: '성능상세조회',
            action: function (evt, item) {
              nwtDetail.popFlag = true;
              nwtDetail.goPerformanceDetail(dataObj);
            }
          });
        }

          items.push({
            text: '고장상세조회',
            action: function(evt, item){
              nwtDetail.popFlag = true;
              nwtDetail.goFailureDetail(dataObj);
            }
          });
        }

        // 실장도
        // 주제어장치 - MME, GW, PCRF
        // DU
        if(dataObj.image.startsWith("mme") || dataObj.image.startsWith("pgw")
            || dataObj.image.startsWith("sgw") || dataObj.image.startsWith("pcrf")
            || dataObj.image.startsWith("du") ) {
          items.push({
            text: '고장위치(실장도)',
            action: function(evt, item) {
              nwtDetail.goFailureLocation(dataObj);
            }
          });
        }

        //if ( isNode && !(dataObj.image.indexOf("bg_") >= 0) ) {
        //  //응용 시스템 - PTT, STORAGE, 지령은 TREND가 없음
        //  // 스위치 - Trend가 아닌 다른 메뉴
        //  if(!(dataObj.image.startsWith("ptt_") || dataObj.image.startsWith("storage_") || dataObj.image.startsWith("giryoung_")
        //      || dataObj.image.startsWith("l2_")|| dataObj.image.startsWith("l3_")) ) {
        //
        //    items.push({
        //      text: 'Trend',
        //      action: function(evt, item) {
        //        nwtDetail.goDialogTrend(dataObj.equip_type, dataObj.equip_name, dataObj.system_id, dataObj.system_name);
        //      }
        //    });
        //  }
        //
        //  if( !(dataObj.image.startsWith("l2_") || dataObj.image.startsWith("l3_")) ) {
        //    items.push({
        //      text: '상세조회',
        //      action: function(evt, item){
        //        nwtDetail.goDialogDetail(dataObj.equip_type, dataObj.equip_name, dataObj.system_id, dataObj.system_name);
        //      }
        //    });
        //  }
        //}
      }
      //}
      
      /*
      var isNode;
      if (data) {
        var isShapeNode = data instanceof Q.ShapeNode;
        var isGroup = data instanceof Q.Group;
        isNode = !isShapeNode && data instanceof Q.Node;
        var isEdge = data instanceof Q.Edge;

        items.push({
          text: getI18NString('Rename'), action: function (evt, item) {
            Q.prompt(getI18NString('Input Element Name'), data.name || '', function (name) {
              if (name === null) {
                return;
              }
              data.name = name;
            })
          }
        });
        if (isEdge) {
          var isDashLine = data.getStyle(Q.Styles.EDGE_LINE_DASH) || Q.DefaultStyles[Q.Styles.EDGE_LINE_DASH];
          items.push({
            text: isDashLine ? getI18NString('Solid Line') : getI18NString('Dashed Line'), action: function (evt, item) {
              data.setStyle(Q.Styles.EDGE_LINE_DASH, isDashLine ? null : [5, 3]);
            }
          });
          items.push({
            text: getI18NString('Line Width'), action: function (evt, item) {
              Q.prompt(getI18NString('Input Line Width'), data.getStyle(Q.Styles.EDGE_WIDTH) || Q.DefaultStyles[Q.Styles.EDGE_WIDTH], function (lineWidth) {
                if (lineWidth === null) {
                  return;
                }
                lineWidth = parseFloat(lineWidth);
                data.setStyle(Q.Styles.EDGE_WIDTH, lineWidth);
              })
            }
          });
          items.push({
            text: getI18NString('Line Color'), action: function (evt, item) {
              Q.prompt(getI18NString('Input Line Color'), data.getStyle(Q.Styles.EDGE_COLOR) || Q.DefaultStyles[Q.Styles.EDGE_COLOR], function (color) {
                if (color === null) {
                  return;
                }
                data.setStyle(Q.Styles.EDGE_COLOR, color);
              })
            }
          });
        } else if (data.parent instanceof Q.Group) {
          items.push({
            text: getI18NString('Out of Group'), action: function () {
              data.parent = null;
            }
          })
        }
        items.push(Q.PopupMenu.Separator);
        items.push({
          text: getI18NString('Send to Top'), action: function (evt, item) {
            data.zIndex = 1;
            graph.sendToTop(data);
            graph.invalidate();
          }
        });
        items.push({
          text: getI18NString('Send to Bottom'), action: function (evt, item) {
            data.zIndex = -1;
            graph.sendToBottom(data);
            graph.invalidate();
          }
        });
        items.push({
          text: getI18NString('Reset Layer'), action: function (evt, item) {
            data.zIndex = 0;
            graph.invalidate();
          }
        });
        items.push(Q.PopupMenu.Separator);
      }
      items.push({
        text: getI18NString('Clear Graph'), action: function () {
          graph.clear();
        }
      })
		*/
      /*
      if(global.map_mode == "view") {
    	  items.push({
    		  text: getI18NString('편집모드'), action: function (evt, item) {
    			  graph.forEach(function(element){
    				  if(element.nodetype == "equip") {
    					  element.movable = true;
    				  }
    			  });
    			  graph.interactionMode = "VPC";
    			  editClick();
    		  }
    	  });
      } else {
    	  items.push({
    		  text: getI18NString('감시모드'), action: function (evt, item) {
    			  graph.forEach(function(element){
    				  element.movable = false;
    			  });
    			  graph.interactionMode = "RJS";
    			  viewClick();
    		  }
    	  });
      }

      items.push(Q.PopupMenu.Separator);

      items.push({
        text: getI18NString('Zoom In'), action: function (evt, item) {
          var localXY = graph.globalToLocal(evt);
          graph.zoomIn(localXY.x, localXY.y, true);
        }
      });
      items.push({
        text: getI18NString('Zoom Out'), action: function (evt, item) {
          var localXY = graph.globalToLocal(evt);
          graph.zoomOut(localXY.x, localXY.y, true);
        }
      });
      if (isNode){
      items.push({
        text: getI18NString('Trend'), action: function (evt, item) {
                var trend_param = {};
                trend_param.nodetype = data.nodetype;
                trend_param.equip_type = data.equip_type;
                trend_param.location_id = data.location_id;
                trend_param.equip_id = data.equip_id;
                trend_param.param_service_id = global.param_service_id;
                trend_param.map_level = global.map_level;
                trend_param.equip_type_id = data.equip_type_id;
                global.trend_param = trend_param;

                var window_trend = window.open('/popup_trend/popup_trend', 'Trend_Pop', 'width=1000, height=530, menubar=no, status=no, toolbar=no, location=no');
                window_trend.focus();
            }
          });
      }
*/
      // equip_type : 장비이름, location_id : 국사 , equip_id : 장비ID (상세에만 존재)
      // param_service_id : function_id
      //

//      items.push({
//        text: getI18NString('1:1'), action: function (evt, item) {
//          var localXY = graph.globalToLocal(evt);
//          graph.scale = 1;
//        }
//      });
//      items.push(Q.PopupMenu.Separator);
//      var currentMode = graph.interactionMode;
//      var interactons = [
//        {text: getI18NString('Pan Mode'), value: Q.Consts.INTERACTION_MODE_DEFAULT},
//        {text: getI18NString('Rectangle Select'), value: Q.Consts.INTERACTION_MODE_SELECTION}
//      ];
//      for (var i = 0, l = interactons.length; i < l; i++) {
//        var mode = interactons[i];
//        if (mode.value == currentMode) {
//          mode.selected = true;
//        }
//        mode.action = function (evt, item) {
//          graph.interactionMode = item.value;
//        };
//        items.push(mode)
//      }
      return items;
    }
  }
  Object.defineProperties(PopupMenu.prototype, {
    items: {
      get: function () {
        return this._items;
      },
      set: function (v) {
        this._items = v;
        this._invalidateFlag = true;
      }
    }
  });

  var _contextmenuListener = {
    onstart: function (evt, graph) {
      graph._popupmenu.hide();
    }
  }
  function getPageXY(evt) {
    if (evt.touches && evt.touches.length) {
      evt = evt.touches[0];
    }
    return {x: evt.pageX, y: evt.pageY};
  }

  function showMenu(evt, graph) {
    var menu = graph.popupmenu;
    var xy = getPageXY(evt);
    var x = xy.x, y = xy.y;

    var items = menu.getMenuItems(graph, graph.getElement(evt), evt);

    if(!items){
      return;
    }
    menu.items = items;
    menu.showAt(x, y);

    Q.stopEvent(evt);
  }
  if(Q.isTouchSupport){
    _contextmenuListener.onlongpress = function (evt, graph) {
      showMenu(evt, graph);
    }
  }

  Object.defineProperties(Q.Graph.prototype, {
    popupmenu: {
      get: function(){
        return this._popupmenu;
      },
      set: function(v){
        if(this._popupmenu == v){
          return;
        }
        this._popupmenu = v;

        if(!this._contextmenuListener){
          this._contextmenuListener = _contextmenuListener;
          this.addCustomInteraction(this._contextmenuListener);
          this.html.oncontextmenu = function (evt) {
            showMenu(evt, this);
          }.bind(this);
        }
      }
    }
  });
  Q.PopupMenu = PopupMenu;
})(Q, jQuery);
