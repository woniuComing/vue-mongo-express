const storage = {
    set(key, value) {
        sessionStorage.setItem(key, value);
    },
    get(key) {
        return sessionStorage.getItem(key);
    },
    remove(key) {
        sessionStorage.removeItem(key);
    }
}
const formatUTC2ChinaTime = (UTCDateString) => {
    if (!UTCDateString) return false;
    let localdate = new Date(UTCDateString);
    return `${localdate.getFullYear()}-${localdate.getMonth()+1}-${localdate.getDate()} ${localdate.getHours()}:${localdate.getMinutes()}:${localdate.getSeconds()}`;
}

const formatGender = (sex) => {
    let sexFlag = '暂无'
    switch (sex) {
        case 2:
            sexFlag = '女';
            break
        case 1:
            sexFlag = '男';
            break
        case -1:
            sexFlag = '暂无';
            break
    };
    return sexFlag;

}


export { storage, formatUTC2ChinaTime, formatGender };