/**
 *@author       王玮
 *@date         2019-02-18 下午 4:08
 *@Copyright    天源迪科信息技术股份有限公司
 *@Description
 */
import axios from 'axios'

const service = axios.create({
  timeout: 5000
});

export default service
