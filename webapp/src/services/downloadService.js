class downloadService {
    download(content, fileName, contentType) {
        const element = document.createElement("a");
        const file = new Blob([content], {type: contentType});
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        element.click();
    }
}

export default new downloadService();