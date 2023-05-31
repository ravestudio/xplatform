import React from 'react';
import clsx from 'clsx';
import { AgGridReact } from 'ag-grid-react';

var Button = function (props) {
    return React.createElement("button", null, props.label);
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

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var MockEditingContext = React.createContext({
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
            _this.wrappedComponentRef = React.createRef();
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
            return (React.createElement(WrappedComponent, __assign({}, this.props, { isMockEditing: this.state.isMockEditing, ref: this.wrappedComponentRef })));
        };
        return class_1;
    }(React.Component)),
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
        _this.inputRef = React.createRef();
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
            component = (React.createElement("input", { ref: this.inputRef, value: this.state.value, onChange: this.inputChangedHandler }));
        }
        else {
            component = React.createElement("span", null, this.state.value);
        }
        return (React.createElement("div", { className: clsx("cmp", this.props.isMockEditing && "cmp-edit-mode") }, component));
    };
    return TextFieldRenderer;
}(React.Component));
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
            return (React.createElement(WrappedComponent, __assign({}, this.props, { isMockEditing: this.state.isMockEditing })));
        };
        return class_1;
    }(React.Component)),
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
        var _this = this;
        if (!this.state.visible) {
            return null;
        }
        var getActionSettings = function (actionName) {
            var _a;
            var btn = (_a = _this.props.actionButtons) === null || _a === void 0 ? void 0 : _a.filter(function (btn) { return btn.name === actionName; });
            return btn && btn.length > 0 ? btn[0] : undefined;
        };
        var mockEditingIcons = (React.createElement(React.Fragment, null,
            React.createElement("button", { className: "save-icon", onClick: this.saveChanges }, "save"),
            React.createElement("button", { className: "cancel-icon", onClick: this.undoChanges }, "cancel")));
        var editBtnSettings = getActionSettings("edit");
        var nonMockEditingIcons = (React.createElement(React.Fragment, null, this.props.actionButtons.map(function (btn, index) {
            if (btn.name === "edit") {
                return (React.createElement("button", { className: "edit-icon", onClick: editBtnSettings && editBtnSettings.onClick
                        ? function () {
                            return editBtnSettings.onClick({
                                item: _this.props.data,
                            });
                        }
                        : _this.enterMockEditMode }, "edit"));
            }
            if (btn.name === "delete") {
                return (React.createElement("button", { className: "delete-icon", onClick: _this.deleteItem }, "delete"));
            }
        })));
        return (React.createElement("div", { className: "actions-wrapper" }, this.props.isMockEditing ? mockEditingIcons : nonMockEditingIcons));
    };
    ActionsRenderer.contextType = MockEditingContext;
    return ActionsRenderer;
}(React.Component));
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
            return (React.createElement(MockEditingContext.Provider, { value: this.state },
                React.createElement(WrappedComponent, __assign({}, this.props, { mockEditingId: this.state.mockEditingId }))));
        };
        return class_1;
    }(React.Component));
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
        _this.deleteItem = function (item) {
            var _a = item, _b = _this.props.keyField, id = _a[_b], data = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            var e = {
                cancel: false,
                type: "remove",
                key: id,
                data: data,
            };
            if (_this.props.onSaving) {
                var _c = item, _d = _this.props.keyField; _c[_d]; __rest(_c, [typeof _d === "symbol" ? _d : _d + ""]);
                _this.props.onSaving(e);
            }
            if (e.cancel)
                return;
            _this.gridApi.applyTransaction({ remove: [item] });
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
                            delete: _this.deleteItem,
                            actionButtons: _this.props.actionButtons
                                ? _this.props.actionButtons.actions
                                : [
                                    {
                                        name: "edit",
                                    },
                                    {
                                        name: "delete",
                                    },
                                ],
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
        return (React.createElement("div", { className: "ag-grid" },
            React.createElement("div", { className: "grid-toolbar" },
                React.createElement("button", null, "add")),
            React.createElement("div", { className: "ag-theme-alpine", style: { flexGrow: 1, width: "100%" } },
                React.createElement(AgGridReact, __assign({ rowData: this.props.data, gridOptions: this.state.gridOptions, defaultColDef: defaultColDef, getRowNodeId: this.getRowNodeId, onGridReady: this.onGridReady }, this.props.agGridProps, { onSelectionChanged: this.onSelectionChanged, onFirstDataRendered: this.onFirstDataRendered })))));
    };
    Grid.contextType = MockEditingContext;
    return Grid;
}(React.Component));
var Grid$1 = WithMockEditingContext(Grid);

export { Button as Dutton, Grid$1 as Grid };
//# sourceMappingURL=index.js.map
