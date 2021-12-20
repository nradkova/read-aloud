import { storageKeys } from "../keys";

const uploadImage = async (data) => {
    const apiUrl = storageKeys.API_URL;

    const file = new FormData();
    file.append('file', data);
    file.append("upload_preset", "ReadAloud");

    const res = await fetch(apiUrl, { method: "POST", body: file });

    const result = await res.json();
    return result.url;
}

export default uploadImage;