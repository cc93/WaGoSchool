/**
 * Created by congcong on 16/8/14.
 */

if (!PRODUCTION) {
    require('raw!../index-1.2.html');
    require('raw!../css/index-1.2.css');
}

var jsonData = [
    {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
    {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
    {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
    {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
    {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
    {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var FilterableTable = React.createClass({
    getDefaultProps: function () {
        return {
            data: jsonData
        }
    },
    getInitialState(){
        return {
            searchInput: '',
            isShowinStock: false
        }
    },
    handleSearchInputChange: function (searchInput, isShowinStock) {
        this.setState({
            searchInput: searchInput,
            isShowinStock: isShowinStock
        });
    },
    render: function () {
        return (
            <div className="filterable-table">
                <SearchBar
                    searchInput={this.state.searchInput}
                    isShowinStock={this.state.isShowinStock}
                    onSearchInputChange={this.handleSearchInputChange}
                />
                <MyTable
                    data={this.props.data}
                    searchInput={this.state.searchInput}
                    isShowinStock={this.state.isShowinStock}
                />
            </div>
        )

    }
});

var MyTable = React.createClass({
    render: function () {
        var category = {};
        var rowData = [];
        this.props.data.forEach(function (v, i) {
            if (!category[v.category]) {
                category[v.category] = [];
            }
            category[v.category].push(v);   //分类
        });
        for (var c in category) {      //插入行数据
            //行:类别
            rowData.push(
                <tr key={c}>
                    <th colSpan="2" style={{color:'blue'}}>{c}</th>
                </tr>
            );

            category[c].forEach(function (p) {
                //filter
                if ((p.name.indexOf(this.props.searchInput) === -1) || (!p.stocked && this.props.isShowinStock)) {
                    return;
                }
                //行:产品
                rowData.push(
                    <tr key={p.name} style={{color:p.stocked? 'black':'red'}}>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                    </tr>
                );
            }.bind(this));
        }
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowData}
                    </tbody>
                </table>
            </div>
        );
    }
});

var SearchBar = React.createClass({
    handleChange: function () {
        this.props.onSearchInputChange(this.refs.searchInput.value, this.refs.isShowinStock.checked);
    },
    render: function () {
        return (
            <div>
                <form>
                    <input ref="searchInput" type="text" placeholder="Search.." value={this.props.searchInput}
                           style={{display:'block'}} onChange={this.handleChange}/>
                    <label style={{display:'block'}}>
                        <input ref="isShowinStock" type="checkbox"
                               checked={this.props.isShowinStock}
                               onChange={this.handleChange}/>
                        Only show products in stock
                    </label>
                </form>
            </div>
        );
    }
});


ReactDOM.render(
    <FilterableTable data={jsonData}/>,
    document.getElementById('app')
);