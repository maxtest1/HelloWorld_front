import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/api/app/HelloWorld-08c666/world';

export async function add(params) {
  console.log('worldApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('worldApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('worldApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function getPage(params) {
  console.log('worldApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/getPage`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}





