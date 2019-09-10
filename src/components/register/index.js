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
                password: '',
                email: '',
                gender: 0,
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
        register(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //初步验证通过
                    BaseRequest.userRegister({
                        email: this.ruleForm.email,
                        password: this.ruleForm.password,
                        gender: this.ruleForm.gender
                    }).then(res => {
                        console.log(res);
                        if (res.data.status) {
                            // console.log('success');
                            this.$message({
                                message: '注册成功',
                                type: 'success'
                            })
                            this.$router.push('/login');
                        }
                    })
                } else {
                    console.log('login failed!!');
                    return false;
                }
            });
        },
        go() {
            this.$router.push('/register');
        }
    }
}