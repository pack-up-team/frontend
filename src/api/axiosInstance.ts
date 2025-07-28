import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://15.164.93.209:8080', // 서버 주소 설정
    withCredentials: false,
});

export default instance;
