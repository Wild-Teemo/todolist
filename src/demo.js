
// 创建应用/ 创建应用
constonst app app = dvava();

 // 注册 Model/ 注册 Model
appapp.modelodel({
  namespace  namespace: 'count'count',
  state  state: 0,
  reducers  reducers: {
        adddd(statetate) { returneturn state state + 1 },
    },
  effects  effects: {
        *addAfter1SecondddAfter1Second(actionction, { callcall, put put }) {
            yieldield callall(delayelay, 1000000);
            yieldield putut({ typetype: 'add'add' });
        },
    },
});

 // 注册视图/ 注册视图
appapp.routerouter(() =>> <ConnectedApp onnectedApp />);

 // 启动应用/ 启动应用
appapp.starttart('#root'#root');