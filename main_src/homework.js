
let Record = Ext.data.Record.create([
    { name: 'id' },
    { name: 'name' },
    { name: 'klass' },
    { name: 'gender' },
    { name: 'age' },
    { name: 'birthday', type: 'date', dateFormat: 'Y-m-d' },
    { name: 'avatar' },
]);
//viewConfig
var viewConfig = new Ext.grid.GroupingView({
    forceFit: true,
    enableRowBody: true,
    getRowClass: function (record, index) {
        switch (record.data.klass) {
            case '老总': return 'super';
            case '经理': return 'manager';
        }
    }
})

//data
var data = [
    ['1', 'Jerry Li', '员工', '男', 22, '1997-01-25', 'avatar.jpg'],
    ['2', 'Hong laoban', '经理', '男', 22, '1997-01-25', 'one.jpg'],
    ['3', 'Guan ge', '老总', '男', 22, '1997-01-25', 'sister.jpg'],
    ['4', 'Ethan Huang', '组长', '男', 22, '1997-01-25', 'avatar.jpg'],
    ['5', 'Felicity Chen', '班长', '男', 22, '1997-01-25', 'avatar.jpg'],
    ['6', 'Tao ge', '需求', '男', 22, '1997-01-25', 'avatar.jpg'],
]
var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel([
    new Ext.grid.RowNumberer(),
    sm,
    { header: '编号', dataIndex: 'id', sortable: true, editor: new Ext.grid.GridEditor(new Ext.form.TextField({ allowBlank: false })), align: 'center' },
    { header: '姓名', dataIndex: 'name', editor: new Ext.grid.GridEditor(new Ext.form.TextField({ allowBlank: false })), width: 100, align: 'center' },
    { header: '阶级', dataIndex: 'klass', editor: new Ext.grid.GridEditor(new Ext.form.TextField({ allowBlank: false })), align: 'center' },
    { header: '性别', dataIndex: 'gender', editor: new Ext.grid.GridEditor(new Ext.form.TextField({ allowBlank: false })), align: 'center' },
    { header: '年龄', dataIndex: 'age', editor: new Ext.grid.GridEditor(new Ext.form.TextField({ allowBlank: false })), align: 'center' },
    { header: '生日', dataIndex: 'birthday', renderer: Ext.util.Format.dateRenderer('Y-m-d'), editor: new Ext.grid.GridEditor(new Ext.form.TextField({ allowBlank: false })), align: 'center' },
    { header: '头像', dataIndex: 'avatar', renderer: (value) => { return `<img src="${value}">` }, width: 150, editor: new Ext.grid.GridEditor(new Ext.form.TextField({ allowBlank: false })), align: 'center' }
]);
//store
var store = new Ext.data.GroupingStore({
    // proxy: new Ext.data.HttpProxy({ url: 'homework.json' }),
    proxy: new Ext.data.PagingMemoryProxy(data),
    reader: new Ext.data.ArrayReader({}, [
        { name: 'id' },
        { name: 'name' },
        { name: 'klass' },
        { name: 'gender' },
        { name: 'age' },
        { name: 'birthday', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'avatar' },
    ]),
    groupField: 'klass',
    sortInfo: { field: 'name', direction: 'ASC' }
});
//buttons
let insert = new Ext.Button({
    text: '增加',
    handler: () => {
        let record = new Record({
            id: '7',
            name: 'Alex Liu',
            klass: '经理',
            gender: 'female',
            age: 32,
            birthday: '1989-01-01',
            avatar: 'avatar.jpg'
        })
        let index = Ext.getCmp('grid').getSelectionModel().getSelected()
        Ext.getCmp('grid').stopEditing()
        index = index == undefined ? 0 : store.indexOf(index)
        store.insert(index, record)
        Ext.getCmp('grid').startEditing(0, 0);
    }
})
let del = new Ext.Button({
    text: '删除',
    handler: () => {
        Ext.Msg.confirm('注意', '确定要删除？', function (btn) {
            if (btn == 'yes') {
                let list = Ext.getCmp('grid').getSelectionModel().getSelections()
                list.forEach(i => { store.remove(i); })
                Ext.getCmp('grid').view.refresh();
            }
        })

    }
})
let save = new Ext.Button({
    text: '保存',
    handler: () => {
        var m = store.modified.slice(0);
        var jsonArray = [];
        Ext.each(m, function (item) {
            jsonArray.push(item.data);
        });
        console.log(jsonArray)
        Ext.Msg.alert('保存', jsonArray.length)
    }
})

//bbar
var bottomBar = new Ext.PagingToolbar({
    pageSize: 3,
    store: store,
    displayInfo: true,
    displayMsg: '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
    emptyMsg: "没有记录"
})
//menu
let upper = {
    text: '上移',
    handler: function (a, b, c) {
        let selected = Ext.getCmp('grid').getSelectionModel().getSelected()
        Ext.getCmp('grid').stopEditing()
        let index = store.indexOf(selected) - 1
        store.remove(selected)
        store.insert(index, selected)
        Ext.getCmp('grid').startEditing(0, 0);
    }
}
let downer = {
    text: '下移',
    handler: function (a, b, c) {
        let selected = Ext.getCmp('grid').getSelectionModel().getSelected()
        Ext.getCmp('grid').stopEditing()
        let index = store.indexOf(selected) + 1
        store.remove(selected)
        store.insert(index, selected)
        Ext.getCmp('grid').startEditing(0, 0);
    }
}
let toper = {
    text: '头部',
    handler: function (a, b, c) {
        let selected = Ext.getCmp('grid').getSelectionModel().getSelected()
        Ext.getCmp('grid').stopEditing()
        store.remove(selected)
        store.insert(0, selected)
        Ext.getCmp('grid').startEditing(0, 0);
    }
}
let bottom = {
    text: '尾部',
    handler: function (a, b, c) {
        let selected = Ext.getCmp('grid').getSelectionModel().getSelected()
        Ext.getCmp('grid').stopEditing()
        store.remove(selected)
        store.insert(3, selected)
        Ext.getCmp('grid').startEditing(0, 0);
    }
}
var contextmenu = new Ext.menu.Menu({
    items: [upper, downer, toper, bottom]
});
var toolBar = new Ext.Toolbar([insert, '-', del, '-', save, '-', { xtype: 'splitbutton', text: '其他操作', contextmenu }])