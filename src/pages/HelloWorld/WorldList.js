import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Badge,
  Form,
  Input,
  Button,
  Table,
  Avatar,
  Select,
  DatePicker,
  Pagination,
  InputNumber,
  Tabs,
  Modal,
} from 'antd';

import moment from 'moment';
import styles from './WorldList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";

const { RangePicker } = DatePicker;
const EditableContext = React.createContext();
const FormItem = Form.Item;
const EditableFormRow = Form.create()(({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
));

// 弹窗增加配置项
const CreateForm = Form.create()(prop => {
  const { modalVisible, form, handleAdd, hideAddModal } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新增"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideAddModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="应用名（中文）" hasFeedback>
        {form.getFieldDecorator('appNameCn', {
          rules: [{ required: true, message: '请输入应用名（中文）！' }],
        })(
          <Input placeholder="请输入应用名（中文）" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="应用名描述" hasFeedback>
        {form.getFieldDecorator('appDesc', {
          rules: [{ required: true, message: '请输入应用名描述！' }],
        })(
          <Input placeholder="请输入应用名描述" />)}
      </FormItem>
    </Modal>
  );
});

const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, hideEditModal, item } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="编辑"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideEditModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="应用名">
        {form.getFieldDecorator('appName', {
          initialValue: item.appName,
          rules: [{ required: true, message: '请输入应用名！' }],
        })(
          <Input placeholder="请输入应用名"  />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="应用名（中文）">
        {form.getFieldDecorator('appNameCn', {
          initialValue: item.appNameCn,
          rules: [{ required: true, message: '请输入应用名（中文）！' }],
        })(
          <Input placeholder="请输入应用名（中文）"  />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="应用名描述">
        {form.getFieldDecorator('appDesc', {
          initialValue: item.appDesc,
          rules: [{ required: true, message: '请输入应用名描述！' }],
        })(
          <Input placeholder="请输入应用名描述"  />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="group">
        {form.getFieldDecorator('group', {
          initialValue: item.group,
          rules: [{ required: true, message: '请输入group！' }],
        })(
          <Input placeholder="请输入group"  />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="artifact">
        {form.getFieldDecorator('artifact', {
          initialValue: item.artifact,
          rules: [{ required: true, message: '请输入artifact！' }],
        })(
          <Input placeholder="请输入artifact"  />
        )}
      </FormItem>
    </Modal>
  );
});

// 可编辑的列中的元素
class EditableCell extends PureComponent {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                      rules: [
                          {
                              required: true,
                              message: `请输入 ${title}!`,
                          },
                      ],
                      initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
              restProps.children
              )}
            </td>
          );
          }}
      </EditableContext.Consumer>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ worldModel, authModel, loading}) => ({
  worldModel,
  authModel,
  loading: loading.models.worldModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class WorldList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
  };

  columns = [
    {
      name: 'appNameCn',
      title: '应用名（中文）',
      dataIndex: 'appNameCn',
      width: '20%',
    },
    {
      name: 'appDesc',
      title: '应用名描述',
      dataIndex: 'appDesc',
      width: '20%',
    },
    {
      name: 'group',
      title: 'group',
      dataIndex: 'group',
      width: '20%',
    },
    {
      name: 'artifact',
      title: 'artifact',
      dataIndex: 'artifact',
      width: '20%',
    },
    {
      name: 'edit',
      title: '编辑',
      dataIndex: 'edit',
      width: '10%',
      render: (text, record) => (
        <span>
          <Button type="primary" icon="edit" onClick={() => this.showEditModal(record)} />
        </span>
      ),
    },
    {
      name: 'delete',
      title: '删除',
      dataIndex: 'delete',
      editable: false,
      width: '5%',
      render: (text, row) => (
        <span>
          <Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(row)} />
        </span>
      ),
    },
  ];

  // 界面初始化函数
  componentDidMount() {
    // 获取权限
    this.getAuth();

    // 获取页面的总个数
    this.getPageData(1);
  }

  // 刷新用户界面的权限
  getAuth() {
    const {dispatch} = this.props;
    dispatch({
      type: 'authModel/getAuthOfUser',
    });
  }

  getPageData(pageNo, searchParamInput) {
    const { dispatch } = this.props;
    const {
        worldModel: { searchParam, pager },
    } = this.props;

    this.setTableLoading();
    let param = searchParam;
    if (searchParamInput !== undefined) {
      param = searchParamInput;
    }

    let pagerFinal = pager;
    if (pageNo !== undefined) {
      pagerFinal = {
        ...pager,
        pageNo,
      };
    }

    console.log("pager param");
    console.log(JSON.stringify(pagerFinal));
    console.log(JSON.stringify(param));

    // 获取页面的总个数
    dispatch({
      type: 'worldModel/getPage',
      payload: {
        pager: pagerFinal,
        searchParam: param,
      },
    });
  }

  expandedRowRender = record => (
    <div>
      <Row>
        <Col span={6}>
          <Badge status="success" text="创建时间：" />
          {/* eslint-disable-next-line radix */}
          <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </Col>
      </Row>
      <br />
    </div>
  );

  showDeleteConfirm = row => {
    const { dispatch } = this.props;
    // console.log('点击');
    // console.log(JSON.stringify(row));
    const showLoading = ()=>this.setTableLoading();
    Modal.confirm({
      title: '确定要删除这条配置',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        console.log('OK');
        dispatch({
          type: 'worldModel/delete',
          payload: {
            id:row.id,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  showAddModal = () => {
    this.setState({
      addModalVisible: true,
    });
  };

  hideAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  showEditModal = record => {
    console.log('点击编辑');
    this.setState({
      item: record,
      editModalVisible: true,
    });
  };

  hideEditModal = () => {
    this.setState({
      editModalVisible: false,
    });
  };

  // 设置表格加载
  setTableLoading = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'worldModel/setTableLoading',
    });
  };

  // 添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    const userInfo = getUserInfo();
    let userName = "";
    if(userInfo !== null) {
      userName = userInfo.displayName;
    }

    this.setTableLoading();

    // 将中间添加的脚本放进去
    const params = {
      ...fields,
      createUserName: userName,
    };

    dispatch({
      type: 'worldModel/add',
      payload: params,
    });

    this.hideAddModal();
  };

  // 判断对象1是否包含对象2的所有属性
  contain = (object1, object2) => {
    let index = 0;
    const keys = Object.keys(object2);
    for (let i = 0; i < keys.length; i += 1) {
      const name = keys[i];
      if (object1[name] && object2[name] === object1[name]) {
        index += 1;
      }
    }
    return index === Object.keys(object2).length;
  };

  handleEdit = fields => {
    const { dispatch } = this.props;
    const { item } = this.state;
    const userInfo = getUserInfo();
    let userName = "";
    if(userInfo !== null) {
      userName = userInfo.displayName;
    }

    console.log('编辑修改');
    console.log(JSON.stringify(fields));
    console.log(JSON.stringify(item));

    // 判断是否有修改，如果没有修改，则不向后端发起更新
    if (!this.contain(item, fields)) {
      this.setTableLoading();
      console.log('有变化需要修改');
      const params = {
        ...Object.assign(item, fields),
        updateUserName: userName,
      };

      console.log(JSON.stringify(params));
      dispatch({
        type: 'worldModel/update',
        payload: params,
      });
    }

    this.hideEditModal();
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    console.log('启动查询');
    this.setTableLoading();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      for(let key in fieldsValue) {
        if(fieldsValue[key] === '') {
          delete fieldsValue[key]
        }
      };
      this.getPageData(1, fieldsValue);
    });
  };

  // 加载搜索输入框和搜索按钮
  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={5}>
            <FormItem label="应用名（中文）">
              {getFieldDecorator('appNameCn')(
                <Input placeholder="请输入" />
               )}
            </FormItem>
          </Col>
          <Col lg={5}>
            <FormItem label="group">
              {getFieldDecorator('group')(
                <Input placeholder="请输入" />
               )}
            </FormItem>
          </Col>
          <Col lg={5}>
            <FormItem label="artifact">
              {getFieldDecorator('artifact')(
                <Input placeholder="请输入" />
               )}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
          <Col md={2} sm={24}>
            <Button icon="plus" type="primary" onClick={this.showAddModal}>
              新建
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  onChange = page => {
    console.log('页面索引修改');

    this.getPageData(page);
  };

  render() {
    const {
       worldModel: { selectState, groupAllCodeList },
    } = this.props;

    // 替换表Table的组件
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const { addModalVisible, editModalVisible, item } = this.state;
    const parentAddMethods = {
      selectState,
      groupAllCodeList,
      handleAdd: this.handleAdd,
      hideAddModal: this.hideAddModal,
    };
    const parentEditMethods = {
      item,
      handleEdit: this.handleEdit,
      hideEditModal: this.hideEditModal,
    };

    const {
       worldModel: { totalNumber, pager, tableList, tableLoading },
    } = this.props;

    const tableInfo = () => (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <Table
            size="middle"
            rowKey={record => record.id}
            components={components}
            dataSource={tableList}
            columns={this.columns}
            loading={tableLoading}
            pagination={false}
            expandedRowRender={this.expandedRowRender}
          />
          <br />
          <Pagination
            showQuickJumper
            onChange={this.onChange}
            defaultCurrent={1}
            total={totalNumber}
            current={pager.pageNo}
            defaultPageSize={pager.pageSize}
          />
        </div>
      </Card>
    );

    return (
      <PageHeaderWrapper>
        {tableInfo()}
        <CreateForm {...parentAddMethods} modalVisible={addModalVisible} />
        <EditForm {...parentEditMethods} modalVisible={editModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default WorldList;
