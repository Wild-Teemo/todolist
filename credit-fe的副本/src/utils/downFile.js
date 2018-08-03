import { API } from './config';

export default function fileDown(id) {
    let a = document.createElement('a');
    let timestamp = new Date().getTime() + 60000;
    a.target = '_blank';
    a.href = `${API}/storage/file/${id}?token=${
        sessionStorage.token
    }&date=${timestamp}`;
    a.click();
}
