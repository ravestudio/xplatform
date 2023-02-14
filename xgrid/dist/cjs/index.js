'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var clsx = require('clsx');
var agGridReact = require('ag-grid-react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var clsx__default = /*#__PURE__*/_interopDefaultLegacy(clsx);

var Button = function (props) {
    return React__default["default"].createElement("button", null, props.label);
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var MockEditingContext = React__default["default"].createContext({
    mockEditingId: null,
    setMockEditingId: function (id, operation) { },
});

var WithMockCellEditor = function (WrappedComponent) { var _a; return _a = /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                isMockEditing: false,
            };
            _this.wrappedComponentRef = React__default["default"].createRef();
            return _this;
        }
        class_1.prototype.refresh = function () {
            this.setState({
                isMockEditing: this.context.mockEditingId === this.props.node.id,
            });
            return true;
        };
        class_1.prototype.getValue = function () {
            return this.wrappedComponentRef.current.getValue();
        };
        /** calls reset on the mock editor */
        class_1.prototype.reset = function () {
            this.wrappedComponentRef.current.reset();
        };
        class_1.prototype.render = function () {
            return (React__default["default"].createElement(WrappedComponent, __assign({}, this.props, { isMockEditing: this.state.isMockEditing, ref: this.wrappedComponentRef })));
        };
        return class_1;
    }(React__default["default"].Component)),
    _a.contextType = MockEditingContext,
    _a; };

var TextFieldRenderer = /** @class */ (function (_super) {
    __extends(TextFieldRenderer, _super);
    function TextFieldRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.inputChangedHandler = function (event) {
            _this.setState({ value: event.target.value });
        };
        _this.state = {
            value: "",
        };
        _this.inputRef = React__default["default"].createRef();
        return _this;
    }
    TextFieldRenderer.prototype.refresh = function () {
        throw new Error("DescriptionRenderer not wrapped with WithMockCellEditor");
    };
    TextFieldRenderer.prototype.componentDidMount = function () {
        this.setState({
            value: this.props.getValue(),
        });
    };
    TextFieldRenderer.prototype.componentDidUpdate = function () {
        if (this.props.isMockEditing) {
            this.inputRef.current.focus();
        }
    };
    TextFieldRenderer.prototype.getValue = function () {
        var field = this.props.column.getColId();
        return [field, this.state.value];
    };
    TextFieldRenderer.prototype.reset = function () {
        this.setState({ value: this.props.getValue() });
    };
    TextFieldRenderer.prototype.render = function () {
        var component;
        this.props.node.isSelected();
        if (this.props.isMockEditing) {
            component = (React__default["default"].createElement("input", { ref: this.inputRef, value: this.state.value, onChange: this.inputChangedHandler }));
        }
        else {
            component = React__default["default"].createElement("span", null, this.state.value);
        }
        return (React__default["default"].createElement("div", { className: clsx__default["default"]("cmp", this.props.isMockEditing && "cmp-edit-mode") }, component));
    };
    return TextFieldRenderer;
}(React__default["default"].Component));
var TextFieldRenderer$1 = WithMockCellEditor(TextFieldRenderer);

var WithMockCellRenderer = function (WrappedComponent) { var _a; return _a = /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                isMockEditing: false,
            };
            return _this;
        }
        class_1.prototype.refresh = function () {
            this.setState({
                isMockEditing: this.context.mockEditingId === this.props.node.id,
            });
            return true;
        };
        class_1.prototype.render = function () {
            return (React__default["default"].createElement(WrappedComponent, __assign({}, this.props, { isMockEditing: this.state.isMockEditing })));
        };
        return class_1;
    }(React__default["default"].Component)),
    _a.contextType = MockEditingContext,
    _a; };

var ActionsRenderer = /** @class */ (function (_super) {
    __extends(ActionsRenderer, _super);
    function ActionsRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.enterMockEditMode = function () {
            if (_this.context.mockEditingId !== null) {
                alert("You can only edit one todo at a time");
                return;
            }
            var nodeId = _this.props.node.id;
            _this.context.setMockEditingId(nodeId, "edit");
        };
        _this.deleteItem = function () {
            if (window.confirm("Удалить?")) {
                var item = _this.props.data;
                _this.props.delete(item);
            }
        };
        _this.saveChanges = function () {
            _this.props.commit();
            setTimeout(function () { return _this.context.setMockEditingId(null, null); }, 0);
        };
        _this.undoChanges = function () {
            _this.props.rollback();
            setTimeout(function () { return _this.context.setMockEditingId(null, null); }, 0);
        };
        _this.state = {
            visible: true,
        };
        return _this;
    }
    ActionsRenderer.prototype.render = function () {
        if (!this.state.visible) {
            return null;
        }
        var mockEditingIcons = (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement("button", { className: "save-icon", onClick: this.saveChanges }, "save"),
            React__default["default"].createElement("button", { className: "cancel-icon", onClick: this.undoChanges }, "cancel")));
        var nonMockEditingIcons = (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement("button", { className: "edit-icon", onClick: this.enterMockEditMode }, "edit"),
            React__default["default"].createElement("button", { className: "delete-icon", onClick: this.deleteItem }, "delete")));
        return (React__default["default"].createElement("div", { className: "actions-wrapper" }, this.props.isMockEditing ? mockEditingIcons : nonMockEditingIcons));
    };
    ActionsRenderer.contextType = MockEditingContext;
    return ActionsRenderer;
}(React__default["default"].Component));
var ActionsRenderer$1 = WithMockCellRenderer(ActionsRenderer);

var WithMockEditingContext = function (WrappedComponent) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(props) {
            var _this = _super.call(this, props) || this;
            /** updates {@link MockEditingContext.mockEditingId} */
            _this.setMockEditingId = function (id) {
                _this.setState(function (prevState) { return (__assign(__assign({}, prevState), { mockEditingId: id })); });
            };
            _this.state = {
                mockEditingId: null,
                setMockEditingId: _this.setMockEditingId,
            };
            return _this;
        }
        class_1.prototype.render = function () {
            return (React__default["default"].createElement(MockEditingContext.Provider, { value: this.state },
                React__default["default"].createElement(WrappedComponent, __assign({}, this.props, { mockEditingId: this.state.mockEditingId }))));
        };
        return class_1;
    }(React__default["default"].Component));
};

/**
 *
 * @param component - a cell renderer component
 * @returns - a boolean value indicating whether the passed component implements the {@link IMockCellEditor | IMockCellEditor interface}
 */
var instanceOfIMockCellEditor = function (component) {
    return (Object.getPrototypeOf(component).hasOwnProperty("getValue") &&
        typeof component.getValue === "function" &&
        Object.getPrototypeOf(component).hasOwnProperty("reset") &&
        typeof component.reset === "function");
};

var getCellRender = function (cl) {
    if (cl.columns && cl.columns.length > 0) {
        return {};
    }
    return {
        cellRenderer: TextFieldRenderer$1,
        cellRendererParams: __assign({}, cl.editorParams),
    };
};
function prepareColumns(cl) {
    return __assign(__assign({}, cl), getCellRender(cl));
}
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(props) {
        var _this = _super.call(this, props) || this;
        _this.gridApi = null;
        _this.onGridReady = function (params) {
            _this.gridApi = params.api;
        };
        _this.getRowNodeId = function (item) {
            return item[_this.props.keyField];
        };
        _this.onSelectionChanged = function () {
            var selectedRows = _this.gridApi.getSelectedRows();
            if (_this.props.onSelectionChanged) {
                _this.props.onSelectionChanged(selectedRows);
            }
        };
        _this.commitChanges = function () {
            var mockEditingNode = _this.gridApi.getRowNode(_this.context.mockEditingId);
            var updatedData = __assign({}, mockEditingNode.data);
            var mockEditors = _this.getMockEditors(mockEditingNode);
            mockEditors.forEach(function (mockEditor) {
                var _a = mockEditor.getValue(), field = _a[0], updatedValue = _a[1];
                updatedData[field] = updatedValue;
            });
            _this.gridApi.applyTransaction({ update: [updatedData] });
        };
        _this.rollbackChanges = function () {
            var mockEditingNode = _this.gridApi.getRowNode(_this.context.mockEditingId);
            var mockEditors = _this.getMockEditors(mockEditingNode);
            mockEditors.forEach(function (mockEditor) {
                mockEditor.reset();
            });
        };
        _this.getMockEditors = function (node) {
            var mockEditors = _this.gridApi
                .getCellRendererInstances({
                rowNodes: [node],
            })
                .map(function (cellRenderer) { return cellRenderer; })
                .filter(function (cellRenderer) { return instanceOfIMockCellEditor(cellRenderer); });
            return mockEditors;
        };
        _this.onFirstDataRendered = function (params) {
            if (_this.props.selectedKeys !== undefined) {
                params.api.forEachNode(function (node) {
                    return node.setSelected(!!node.data &&
                        _this.props.selectedKeys.indexOf(node.data[_this.props.keyField]) >= 0);
                });
            }
        };
        _this.state = {
            gridOptions: {
                columnDefs: __spreadArray(__spreadArray(__spreadArray([], (_this.props.checkboxSelection
                    ? [
                        {
                            checkboxSelection: true,
                            width: 70,
                        },
                    ]
                    : []), true), props.gridConfig.columns.map(function (c) { return prepareColumns(c); }), true), [
                    {
                        cellRenderer: ActionsRenderer$1,
                        cellRendererParams: {
                            editing: __assign({}, _this.props.gridConfig.editing),
                            commit: _this.commitChanges,
                            rollback: _this.rollbackChanges,
                            //delete: this.props.de,
                        },
                        width: 190,
                        pinned: "right",
                    },
                ], false),
                suppressColumnVirtualisation: true,
                suppressRowVirtualisation: true,
                rowSelection: "single",
            },
        };
        return _this;
    }
    Grid.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.mockEditingId !== this.props.mockEditingId) {
            var idToUpdate = this.props.mockEditingId === null
                ? prevProps.mockEditingId
                : this.props.mockEditingId;
            var nodeToUpdate = this.gridApi.getRowNode(idToUpdate);
            var refreshCellsParams = {
                rowNodes: [nodeToUpdate],
                force: true,
            };
            //если ноды не удалены операцией роллбек то обновляем
            if (nodeToUpdate) {
                this.gridApi.refreshCells(refreshCellsParams);
            }
        }
    };
    Grid.prototype.render = function () {
        var defaultColDef = {
            editable: false,
            sortable: true,
            //flex: 1,
            minWidth: 10,
            filter: true,
            resizable: true,
        };
        return (React__default["default"].createElement("div", { className: "ag-grid" },
            React__default["default"].createElement("div", { className: "grid-toolbar" },
                React__default["default"].createElement("button", null, "add")),
            React__default["default"].createElement("div", { className: "ag-theme-alpine", style: { flexGrow: 1, width: "100%" } },
                React__default["default"].createElement(agGridReact.AgGridReact, __assign({ rowData: this.props.data, gridOptions: this.state.gridOptions, defaultColDef: defaultColDef, getRowNodeId: this.getRowNodeId, onGridReady: this.onGridReady }, this.props.agGridProps, { onSelectionChanged: this.onSelectionChanged, onFirstDataRendered: this.onFirstDataRendered })))));
    };
    Grid.contextType = MockEditingContext;
    return Grid;
}(React__default["default"].Component));
var Grid$1 = WithMockEditingContext(Grid);

exports.Dutton = Button;
exports.Grid = Grid$1;
//# sourceMappingURL=index.js.map
