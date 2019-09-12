import * as BaseRequest from '../../api/index.js';
import { formatUTC2ChinaTime, formatGender } from '../../utils/Fun';
export default {
    data() {
        return {
            page: 1,
            totalcount: 0,
            formInline: {
                email: '',
                date: '',
                gender: ''
            },
            tableData: [],
            dialogFormVisible: false,
            formLabelWidth: '120px',
            dialogform: {
                email: '',
                date: '',
                gender: -1,
            },
            genderArr: [{
                    value: 2,
                    label: '女'
                },
                {
                    value: 1,
                    label: '男'
                }

            ]
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        formatTime(row, column, cellvalue, index) {
            // console.log(row, column, cellvalue, index);
            return cellvalue = formatUTC2ChinaTime(cellvalue);
        },
        formatGender(row, column, cellvalue, index) {
            return cellvalue = formatGender(cellvalue);
        },
        onSubmit() {
            // console.log(this.formInline);
            this.getList();
        },
        handleClick(row) {
            // console.log(row);
            this.dialogFormVisible = true;
            // this.dialogform = {...row };
            Object.assign(this.dialogform, row);
        },
        //删除列表
        deleteList(row) {
            this.$confirm('此操作将永久删除该列表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确定执行的事件
                BaseRequest.userDelete({ email: row.email }).then(res => {
                    console.log(res);
                    if (res.data.status == 1) {
                        //删除成功
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //更新数据
                        this.getList();
                    }
                }).catch(err => {
                    console.log('delete failed', err);
                    this.$message({
                        type: 'error',
                        message: '删除失败，请稍后重试~'
                    });
                })

            }).catch(() => {
                //点击取消的事件
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });
            });
            console.log(row);
        },
        //更新列表信息
        updateList() {
            //关闭对话框
            BaseRequest.userUpdate({ _id: this.dialogform._id, email: this.dialogform.email, gender: this.dialogform.gender }).then(
                res => {
                    // console.log(res);
                    if (res.data.status) {
                        this.$message({
                            type: 'success',
                            message: '更新成功'
                        })
                    }
                    this.dialogFormVisible = false;
                    this.getList();
                }
            ).catch(err => {
                // console.log(err);
                this.$message({
                    type: 'error',
                    message: '更新失败，请稍后重试~'
                })
            })
        },
        async getList() {
            try {
                const listData = await BaseRequest.userList({
                    page: this.page,
                    email: this.formInline.email,
                    date: this.formInline.date,
                    gender: this.formInline.gender
                });
                console.log('列表数据', listData);
                this.tableData = listData.data.data;
                this.totalcount = listData.data.total;
            } catch (err) {
                console.log(err);
            }
        },
        changePage(page) {
            console.log(page);
            this.page = page;
            this.getList();
        }
    }
}