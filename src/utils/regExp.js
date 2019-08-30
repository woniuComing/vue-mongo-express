const regExp = {
    email: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"),
    phoneNum: /^1[23456789]\d{9}$/,
    chinese: new RegExp("^[\u4E00-\u9FA5]+$")
};

function regExpFun(reg, params) {
    return regExp[reg].test(params);
}

export default regExpFun;