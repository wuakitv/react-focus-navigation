(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global['react-focus-navigation'] = {}),global.React));
}(this, (function (exports,React) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;

  var HORIZONTAL = "horizontal";
  var VERTICAL = "vertical";
  var MATRIX = "matrix";
  var ENTER = "enter";
  var UP = "up";
  var DOWN = "down";
  var LEFT = "left";
  var RIGHT = "right";
  var DEFAULT = "default";
  var POSITIVE = "positive";
  var NEGATIVE = "negative";

  var controllerContext = {
    addParentToTree: function addParentToTree() {
      throw new Error("addParentToTree method has to be implemented. It happens because ControllerContext.Provider is not used");
    },
    deleteParentFromTree: function deleteParentFromTree() {
      throw new Error("deleteParentFromTree has to be implemented. It happens because ControllerContext.Provider is not used");
    },
    hasFocus: function hasFocus() {
      throw new Error("hasFocus has to be implemented. It happens because ControllerContext.Provider is not used");
    },

    findAnotherParent: function findAnotherParent() {
      throw new Error("findAnotherParent has to be implemented. It happens because ControllerContext.Provider is not used");
    }
  };

  var ControllerContext = React.createContext(controllerContext);

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var keyMapping = {
    "37": LEFT,
    "38": UP,
    "39": RIGHT,
    "40": DOWN,
    "13": ENTER
  };

  var Controller = function (_React$Component) {
    inherits(Controller, _React$Component);

    function Controller(props) {
      classCallCheck(this, Controller);

      var _this = possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, props));

      _this.currentFocus = 0;
      _this.state = {
        tree: [],
        addParentToTree: _this.addParentToTree.bind(_this),
        deleteParentFromTree: _this.deleteParentFromTree.bind(_this),
        hasFocus: _this.hasFocus.bind(_this),
        findAnotherParent: _this.findAnotherParent.bind(_this)
      };
      return _this;
    }

    createClass(Controller, [{
      key: "onKeyDown",
      value: function onKeyDown(evt) {
        var keymap = keyMapping[evt.keyCode];

        if (this.currentFocus === null) return null;

        if (keymap === ENTER) {
          return this.handleEnter();
        } else {
          this.handleFocus(keymap);
        }
      }
    }, {
      key: "handleEnter",
      value: function handleEnter() {
        var tree = this.state.tree;

        var currentFocus = this.getFocusState();
        var parent = tree[currentFocus];
        var parentState = parent.state;
        if (parentState.tree[parent.currentFocus].props.onEnter) {
          return parentState.tree[parent.currentFocus].props.onEnter();
        }
      }
    }, {
      key: "setFocusState",
      value: function setFocusState(index, cb) {
        this.currentFocus = index;
        if (cb) cb(this.currentFocus);
      }
    }, {
      key: "getFocusState",
      value: function getFocusState() {
        return this.currentFocus;
      }
    }, {
      key: "hasFocus",
      value: function hasFocus(parent) {
        return this.state.tree[this.currentFocus] === parent;
      }
    }, {
      key: "handleFocus",
      value: function handleFocus(direction) {
        var tree = this.state.tree;

        var index = this.getFocusState();

        if (tree[index].state.type === HORIZONTAL) this.handleFocusInHorizontalParent(direction);

        if (tree[index].state.type === VERTICAL) this.handleFocusInVerticalParent(direction);

        if (tree[index].state.type === MATRIX) this.handleFocusInMatrixParent(direction);
      }
    }, {
      key: "findAnotherParent",
      value: function findAnotherParent() {
        if (this.canMoveToNextParent()) {
          this.moveFocusInTree(POSITIVE);
        } else if (this.canMoveToPreviousParent()) {
          this.moveFocusInTree(NEGATIVE);
        } else {
          this.setEmptyState();
        }
      }
    }, {
      key: "setEmptyState",
      value: function setEmptyState() {
        this.currentFocus = null;
      }
    }, {
      key: "canMoveToPreviousParent",
      value: function canMoveToPreviousParent() {
        return this.getFocusState() > 0;
      }
    }, {
      key: "canMoveToNextParent",
      value: function canMoveToNextParent() {
        var tree = this.state.tree;


        return this.getFocusState() < tree.length - 1;
      }
    }, {
      key: "focusInParentOnInitEdge",
      value: function focusInParentOnInitEdge() {
        var tree = this.state.tree;

        var currentFocus = this.getFocusState();

        return tree[currentFocus].currentFocus === 0;
      }
    }, {
      key: "focusInParentOnFinalEdge",
      value: function focusInParentOnFinalEdge() {
        var tree = this.state.tree;

        var currentFocus = this.getFocusState();

        return tree[currentFocus].currentFocus === tree[currentFocus].state.tree.length - 1;
      }
    }, {
      key: "handleFocusInVerticalParent",
      value: function handleFocusInVerticalParent(direction) {
        var tree = this.state.tree;

        var currentFocus = this.getFocusState();

        if (direction === LEFT && this.canMoveToPreviousParent()) {
          this.moveFocusInTree(NEGATIVE);
        }

        if (direction === RIGHT && this.canMoveToNextParent()) {
          this.moveFocusInTree(POSITIVE);
        }

        if (direction === UP) {
          if (this.focusInParentOnInitEdge() && this.canMoveToPreviousParent()) {
            this.moveFocusInTree(NEGATIVE);
          } else {
            this.moveFocusInParent(tree[currentFocus], NEGATIVE);
          }
        }

        if (direction === DOWN) {
          if (this.focusInParentOnFinalEdge() && this.canMoveToNextParent()) {
            this.moveFocusInTree(POSITIVE);
          } else {
            this.moveFocusInParent(tree[currentFocus], POSITIVE);
          }
        }
      }
    }, {
      key: "handleFocusInHorizontalParent",
      value: function handleFocusInHorizontalParent(direction) {
        var tree = this.state.tree;

        var currentFocus = this.getFocusState();

        if (direction === UP && this.canMoveToPreviousParent()) {
          this.moveFocusInTree(NEGATIVE);
        }

        if (direction === DOWN && this.canMoveToNextParent()) {
          this.moveFocusInTree(POSITIVE);
        }

        if (direction === LEFT) {
          if (this.focusInParentOnInitEdge() && this.canMoveToPreviousParent()) {
            this.moveFocusInTree(NEGATIVE);
          } else {
            this.moveFocusInParent(tree[currentFocus], NEGATIVE);
          }
        }

        if (direction === RIGHT) {
          if (this.focusInParentOnFinalEdge() && this.canMoveToNextParent()) {
            this.moveFocusInTree(POSITIVE);
          } else {
            this.moveFocusInParent(tree[currentFocus], POSITIVE);
          }
        }
      }
    }, {
      key: "handleFocusInMatrixParent",
      value: function handleFocusInMatrixParent(direction) {
        var tree = this.state.tree;

        var currentFocus = this.getFocusState();
        var parent = tree[currentFocus];

        if (direction === RIGHT) {
          if (parent.currentFocus % parent.state.columns !== parent.state.columns - 1) {
            this.quitFocusInParent(tree[currentFocus], tree[currentFocus].currentFocus);
            this.moveFocusInParent(parent, POSITIVE);
          } else if (this.canMoveToNextParent()) {
            this.moveFocusInTree(POSITIVE);
          }
        }

        if (direction === LEFT) {
          if (parent.currentFocus % parent.state.columns !== 0) {
            this.quitFocusInParent(tree[currentFocus], tree[currentFocus].currentFocus);
            this.moveFocusInParent(parent, NEGATIVE);
          } else if (this.canMoveToPreviousParent()) {
            this.moveFocusInTree(NEGATIVE);
          }
        }

        if (direction === DOWN) {
          if (parent.state.columns * parent.state.rows - parent.currentFocus > parent.state.columns) {
            this.quitFocusInParent(tree[currentFocus], tree[currentFocus].currentFocus);
            this.moveFocusInParent(parent, POSITIVE, parent.state.columns);
          } else if (this.canMoveToNextParent()) {
            this.moveFocusInTree(POSITIVE);
          }
        }

        if (direction === UP) {
          if (parent.currentFocus - parent.state.columns >= 0) {
            this.quitFocusInParent(tree[currentFocus], tree[currentFocus].currentFocus);
            this.moveFocusInParent(parent, NEGATIVE, parent.state.columns);
          } else if (this.canMoveToPreviousParent()) {
            this.moveFocusInTree(NEGATIVE);
          }
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown.bind(this));
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        this.setParentFocus(this.getFocusState());
      }
    }, {
      key: "setParentFocus",
      value: function setParentFocus(index) {
        var _this2 = this;

        this.setFocusState(index, function () {
          if (_this2.state.tree.length > 0) {
            var parent = _this2.state.tree[index];
            _this2.moveFocusInParent(parent, DEFAULT);
          }
        });
      }
    }, {
      key: "moveFocusInParent",
      value: function moveFocusInParent(parent, direction) {
        var threeshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var tree = parent.state.tree;


        if (direction === DEFAULT) {
          this.setFocusInParent(parent, parent.currentFocus);
        }

        if (direction === NEGATIVE) {
          if (parent.currentFocus > 0) {
            this.quitFocusInParent(parent, parent.currentFocus);
            this.setFocusInParent(parent, threeshold ? parent.currentFocus - threeshold : parent.currentFocus - 1);
          }
        }

        if (direction === POSITIVE) {
          if (parent.currentFocus < tree.length - 1) {
            this.quitFocusInParent(parent, parent.currentFocus);
            this.setFocusInParent(parent, threeshold ? parent.currentFocus + threeshold : parent.currentFocus + 1);
          }
        }
      }
    }, {
      key: "moveFocusInTree",
      value: function moveFocusInTree(direction) {
        var _this3 = this;

        var tree = this.state.tree;

        var currentFocus = this.getFocusState();
        var nextFocus = direction == NEGATIVE ? currentFocus - 1 : currentFocus + 1;
        this.quitFocusInParent(tree[currentFocus], tree[currentFocus].currentFocus);
        this.setFocusState(nextFocus, function (nextFocus) {
          var parent = _this3.state.tree[nextFocus];

          if (parent.props.onReceive) parent.props.onReceive(nextFocus);

          _this3.moveFocusInParent(parent, DEFAULT);
        });
      }
    }, {
      key: "setFocusInParent",
      value: function setFocusInParent(parent, focusIndex) {
        if (parent.props.onFocus) {
          parent.props.onFocus(focusIndex);
        }
        if (parent.state.tree[focusIndex] && parent.state.tree[focusIndex].props.onFocus) {
          parent.state.tree[focusIndex].props.onFocus();
        }
        parent.currentFocus = focusIndex;
      }
    }, {
      key: "quitFocusInParent",
      value: function quitFocusInParent(parent, focusIndex) {
        if (parent.props.onBlur) {
          parent.props.onBlur(focusIndex);
        }
        if (parent.state.tree[focusIndex] && parent.state.tree[focusIndex].props.onBlur) {
          parent.state.tree[focusIndex].props.onBlur();
        }
        parent.currentFocus = focusIndex;
      }
    }, {
      key: "addParentToTree",
      value: function addParentToTree(parent) {
        this.state.tree.push(parent);

        if (parent.props.withFocus) {
          var currentFocus = this.getFocusState();
          var parentWithFocus = this.state.tree[currentFocus];
          this.quitFocusInParent(parentWithFocus, parentWithFocus.currentFocus);
          this.setParentFocus(this.state.tree.indexOf(parent));
        }
      }
    }, {
      key: "deleteParentFromTree",
      value: function deleteParentFromTree(parent) {
        var currentFocus = this.getFocusState();
        var index = this.state.tree.indexOf(parent);

        if (index === currentFocus) {
          this.state.tree.splice(index, 1);
          this.setParentFocus(0);
        } else {
          if (index < currentFocus) {
            this.setFocusState(currentFocus - 1);
          }
          this.state.tree.splice(index, 1);
        }
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement(
          ControllerContext.Provider,
          { value: this.state },
          this.props.children
        );
      }
    }]);
    return Controller;
  }(React.Component);

  var parentContext = {
    columns: 0,
    rows: 0,
    tree: [],
    type: HORIZONTAL,
    addChildToTree: function addChildToTree() {
      throw new Error("addChildToTree method has to be implemented. It happens because ParentContext.Consumer has been used without the ParentContext.Provider");
    },
    deleteChildFromTree: function deleteChildFromTree() {
      throw new Error("deleteChildFromTree method has to be implemented. It happens because ParentContext.Consumer has been used without the ParentContext.Provider");
    }
  };

  var ParentContext = React.createContext(parentContext);

  var FocusableChild = function (_React$Component) {
    inherits(FocusableChild, _React$Component);

    function FocusableChild(props) {
      classCallCheck(this, FocusableChild);

      var _this = possibleConstructorReturn(this, (FocusableChild.__proto__ || Object.getPrototypeOf(FocusableChild)).call(this, props));

      _this.state = { className: props.className || "focusable" };
      return _this;
    }

    createClass(FocusableChild, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.addToParentTree();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.deleteFromParentTree();
      }
    }, {
      key: "addToParentTree",
      value: function addToParentTree() {
        this.props.context.addChildToTree(this);
      }
    }, {
      key: "deleteFromParentTree",
      value: function deleteFromParentTree() {
        this.props.context.deleteChildFromTree(this);
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement(
          React.Fragment,
          null,
          this.props.children
        );
      }
    }]);
    return FocusableChild;
  }(React.Component);

  var Child = function (_React$Component2) {
    inherits(Child, _React$Component2);

    function Child() {
      classCallCheck(this, Child);
      return possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));
    }

    createClass(Child, [{
      key: "render",
      value: function render() {
        var _this3 = this;

        return React.createElement(
          ParentContext.Consumer,
          null,
          function (value) {
            return React.createElement(FocusableChild, _extends({}, _this3.props, { context: value }));
          }
        );
      }
    }]);
    return Child;
  }(React.Component);

  var ParentWithContext = function (_React$Component) {
    inherits(ParentWithContext, _React$Component);

    function ParentWithContext(props) {
      classCallCheck(this, ParentWithContext);

      var _this = possibleConstructorReturn(this, (ParentWithContext.__proto__ || Object.getPrototypeOf(ParentWithContext)).call(this, props));

      _this.currentFocus = 0;
      _this.addChildToTree = _this.addChildToTree.bind(_this);
      _this.deleteChildFromTree = _this.deleteChildFromTree.bind(_this);

      _this.state = {
        tree: [],
        type: props.focusableType,
        rows: props.rows,
        columns: props.columns,
        id: Math.random() * 1000000000,
        addChildToTree: _this.addChildToTree,
        deleteChildFromTree: _this.deleteChildFromTree
      };
      return _this;
    }

    createClass(ParentWithContext, [{
      key: "addChildToTree",
      value: function addChildToTree(child) {
        this.state.tree.push(child);
      }
    }, {
      key: "deleteChildFromTree",
      value: function deleteChildFromTree(child) {
        var index = this.state.tree.indexOf(child);

        if (index === this.currentFocus) {
          this.state.tree.splice(index, 1);

          if (this.state.tree.length === 0 && this.hasFocusInController()) {
            return this.props.context.findAnotherParent();
          }

          this.currentFocus = index > 0 ? index - 1 : 0;
          if (this.hasFocusInController() && this.state.tree[this.currentFocus].props.onFocus) {
            this.state.tree[this.currentFocus].props.onFocus();
          }
        } else {
          if (index < this.currentFocus) {
            if (this.state.tree[this.currentFocus].props.onBlur) {
              this.state.tree[this.currentFocus].props.onBlur(this.currentFocus);
            }
            this.currentFocus = this.currentFocus - 1;
            if (this.state.tree[this.currentFocus].props.onFocus) {
              this.state.tree[this.currentFocus].props.onFocus(this.currentFocus);
            }
          }
          this.state.tree.splice(index, 1);
        }
      }
    }, {
      key: "hasFocusInController",
      value: function hasFocusInController() {
        return this.props.context.hasFocus(this);
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.props.context.addParentToTree(this);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.props.context.deleteParentFromTree(this);
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement(
          ParentContext.Provider,
          { value: this.state },
          React.createElement(
            "ul",
            {
              onFocus: this.props.onFocus,
              onBlur: this.props.onBlur,
              className: this.props.className
            },
            this.props.children
          )
        );
      }
    }]);
    return ParentWithContext;
  }(React.Component);

  var Parent = function (_React$Component2) {
    inherits(Parent, _React$Component2);

    function Parent() {
      classCallCheck(this, Parent);
      return possibleConstructorReturn(this, (Parent.__proto__ || Object.getPrototypeOf(Parent)).apply(this, arguments));
    }

    createClass(Parent, [{
      key: "render",
      value: function render() {
        var _this3 = this;

        return React.createElement(
          ControllerContext.Consumer,
          null,
          function (state) {
            return React.createElement(ParentWithContext, _extends({}, _this3.props, { context: state }));
          }
        );
      }
    }]);
    return Parent;
  }(React.Component);

  var HorizontalParent = function (_React$Component3) {
    inherits(HorizontalParent, _React$Component3);

    function HorizontalParent() {
      classCallCheck(this, HorizontalParent);
      return possibleConstructorReturn(this, (HorizontalParent.__proto__ || Object.getPrototypeOf(HorizontalParent)).apply(this, arguments));
    }

    createClass(HorizontalParent, [{
      key: "render",
      value: function render() {
        return React.createElement(
          Parent,
          _extends({}, this.props, { focusableType: HORIZONTAL }),
          this.props.children
        );
      }
    }]);
    return HorizontalParent;
  }(React.Component);

  var MatrixParent = function (_React$Component4) {
    inherits(MatrixParent, _React$Component4);

    function MatrixParent() {
      classCallCheck(this, MatrixParent);
      return possibleConstructorReturn(this, (MatrixParent.__proto__ || Object.getPrototypeOf(MatrixParent)).apply(this, arguments));
    }

    createClass(MatrixParent, [{
      key: "render",
      value: function render() {
        return React.createElement(
          Parent,
          _extends({}, this.props, { focusableType: MATRIX }),
          this.props.children
        );
      }
    }]);
    return MatrixParent;
  }(React.Component);

  var VerticalParent = function (_React$Component5) {
    inherits(VerticalParent, _React$Component5);

    function VerticalParent() {
      classCallCheck(this, VerticalParent);
      return possibleConstructorReturn(this, (VerticalParent.__proto__ || Object.getPrototypeOf(VerticalParent)).apply(this, arguments));
    }

    createClass(VerticalParent, [{
      key: "render",
      value: function render() {
        return React.createElement(
          Parent,
          _extends({}, this.props, { focusableType: VERTICAL }),
          this.props.children,
          " "
        );
      }
    }]);
    return VerticalParent;
  }(React.Component);

  exports.Controller = Controller;
  exports.Child = Child;
  exports.VerticalParent = VerticalParent;
  exports.HorizontalParent = HorizontalParent;
  exports.MatrixParent = MatrixParent;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
