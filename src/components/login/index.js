import regExp from '../../utils/regExp';
import { storage } from '../../utils/Fun';
import * as BaseRequest from '../../api/index';
export default {
    data() {
        var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱'));
            } else {
                if (!regExp('email', value)) {
                    callback(new Error('请输入正确的邮箱'));
                }
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                password: storage.get('password') ? storage.get('password') : '',
                email: storage.get('email') ? storage.get('email') : '',
            },
            rules: {
                email: [
                    { required: true, validator: validateName, trigger: 'blur' }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
            }
        };
    },
    methods: {
        login(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //初步验证通过
                    BaseRequest.userRegister({
                        email: this.ruleForm.email,
                        password: this.ruleForm.password
                    }).then(res => {
                        console.log(res);
                        if (res.data.status) {
                            // console.log('success');
                            storage.set('token', res.data.token);
                            storage.set('name', this.ruleForm.email);
                        }
                    })
                } else {
                    console.log('login failed!!');
                    return false;
                }
            });
        }

    }
}