import axios from "axios";
import {ElMessage} from "element-plus";
const requests = axios.create({
    baseURL: 'http://api.023runclub.com',
    timeout: 12000,
    headers: {'X-Custom-Header': 'foobar'}
});
requests.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    ElMessage.error('请求异常，请重试！')
    return Promise.reject(error);
});
export default requests;