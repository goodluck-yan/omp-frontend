<template>
  <div>
        <el-card class="serverManage">
            <div slot="header">
                <span class="bj">主机管理</span>
                <clock class="clock" type="text"></clock>
            </div>
             <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="hostToken" @submit.native.prevent>
                    <el-form-item>
                        <el-input v-model.trim="serverName"  placeholder="输入主机名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="getServerList()" >搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="addServer = true" >添加主机</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="updateServer()" >更新主机</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success"  @click="sshLogin=true" >SSH</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-popover
                            placement="top-start"
                            width="400"
                            title="口令"
                            trigger="click">
                            <el-input v-model.trim="hostToken.sshToken" type="password"  @keyup.enter.native.prevent= "loginHost('hostToken')"   auto-complete="new-password" ></el-input>
                            <el-button  type="success" slot="reference">任意门</el-button>
                            </el-popover>
                    </el-form-item>
                </el-form>
            </el-col>
            
            <el-table
            :data="serverList"
            max-height="400"
            stripe
            highlight-current-row
            >
            <el-table-column type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column
                prop="id"
                label="ID"
                width="50"
                align="center">
            </el-table-column>
            <el-table-column
                prop="hostName"
                label="主机名"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                prop="hostType"
                label="主机类型"
                width="100"
                align="center">
            </el-table-column> 
            <el-table-column
                prop="intranetIp"
                label="内网IP"
                width="140"
                align="center">
            </el-table-column>
            <el-table-column
                prop="ExtranetIp"
                label="外网IP"
                width="140"
                align="center">
            </el-table-column>
            <el-table-column
                prop="IDC"
                label="IDC"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                prop="area"
                label="区域"
                width="140"
                align="center">
            </el-table-column>
            <el-table-column
                label="状态"
                width="100"
                align="center">
                <template slot-scope="scope">
                <el-tag v-if="scope.row.status == 1" type="success" effect="dark" >
                    启用
                </el-tag>
                <el-tag v-else type="warning" effect="dark">
                    禁用
                </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间"
                width="200"
                align="center">
            </el-table-column>
            <el-table-column
                prop="modify_time"
                label="修改时间"
                width="200"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                width="300"
                align="center">
                <template slot-scope="scope">
                <!-- <el-button @click="ssh(scope.row)"  type="success"  size="small" >SSH</el-button> -->
                <el-button @click="modifyClick(scope.row)"  type="primary" size="small" >修改</el-button>
                <el-button @click="delClick(scope.row)"   size="small" type="danger" :disabled="scope.row.id === 1">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
        </el-card>

    	<!--ssh登录界面-->
		<el-dialog class="sshDialog" title="SSH登录" :visible.sync="sshLogin" :close-on-click-modal="false" :width="'25%'" center @submit.native.prevent>
			<el-form :model="sshLoginForm" label-width="100px" :rules="formRules" ref="sshLoginForm">
				<el-form-item label="主机地址:" prop="host_adr" required >
					<el-input v-model.trim="sshLoginForm.host_adr" auto-complete="off" :width="'20%'"></el-input>
				</el-form-item>
				<el-form-item label="端口:" prop="port" required>
					<el-input v-model.trim="sshLoginForm.port" auto-complete="off" :width="'20%'"></el-input>
				</el-form-item>
                <el-form-item label="用户名:" prop="user_name" required>
					<el-input v-model.trim="sshLoginForm.user_name" auto-complete="off" :width="'20%'"></el-input>
				</el-form-item>
                <el-form-item label="密码:" prop="password" required>
					<el-input v-model.trim="sshLoginForm.password" show-password type="password" @keyup.enter.native.prevent= "onSSH('sshLoginForm')" auto-complete="new-password" :width="'20%'"></el-input>
				</el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSSH('sshLoginForm')" :width="'20%'">提交</el-button>
				    <el-button @click.native="sshLogin = false;$refs['sshLoginForm'].resetFields();" :width="'20%'">取消</el-button>
                </el-form-item>
			</el-form>
		</el-dialog> 
    </div>
</template>

<script>
import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import clock from '@/components/Clock'


export default {
    components:{
        clock,  
    },
    data() {
        return {
           hostToken:{
               sshToken:''
           },
           sshTokens:['testnginx','manage'],
           serverName:'',    //主机名
           serverList:[{
                "id":1,
                "hostName":"testcity",
                "hostType":"ECS",
                "intranetIp":"10.10.1.101",
                "ExtranetIp":"192.168.10.4",
                "IDC":"华为云-华南",
                "area":"cn-guangzhou",
                "status": 1,
                "create_time": "2019-10-18 01:19:22", 
                "modify_time": "2019-10-18 14:48:09", 
                
            }],
            sshLogin:false,   //开始隐藏sshlogin登录界面
            sshLoginForm:{
                host_adr:'',
                port:22,
                user_name:'',
                password:'',
            },
           formRules:{
               host_adr:[
                   {type: 'string',required:true,message:'请输入正确的IP地址',trigger:'blur'},
               ],
               port:[
                   {type: 'string',required:true,message:'请输入正确的端口号,默认为22',trigger:'blur'},
               ],
                user_name:[
                   {type: 'string',required:true,message:'请输入正确的用户名',trigger:'blur'},
               ],
                password:[
                   {type: 'string',required:true,message:'请输入正确的密码',trigger:'blur'},
               ]
           } 

        }
    },
    methods: {
        getServerList(){},
        updateServer(){},
        modifyClick(row){},
        delClick(row){},
        onSSH(sshLoginForm){
              this.$refs[sshLoginForm].validate((valid)=>{
                if(valid){    
                    let pwd=this.sshLoginForm.password
                    let encryptor = new JSEncrypt() // 新建JSEncrypt对象
                    let publicKey = 
                    `-----BEGIN PUBLIC KEY-----
                    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDz2N5xTKSoRAFacayfZp1Ka/D2
                    7CA3bfypwz5BwJcKjpaiJEHq001t0LA7ZoGqTOsSepnLD4A9l5zgizl131k3WKvN
                    oaJ0mkslB5/aDsC7V5iCNL47h/aaiiVYJ1qiLB+Cyc4ZqLTqj1tjYRRA/Gbdf6GZ
                    A3ZD7rnStt9kEfV8fwIDAQAB
                    -----END PUBLIC KEY-----`     
                        //把之前生成的贴进来，实际开发过程中，可以是后台传过来的
                    encryptor.setPublicKey(publicKey) // 设置公钥   
                    let rsaPassWord = encryptor.encrypt(pwd) 
                    // 对需要加密的数据进行加密
                    let params={
                        sshParams:'?host='+this.sshLoginForm.host_adr+'&port='+this.sshLoginForm.port+'&user='+this.sshLoginForm.user_name+'&password='+window.btoa(rsaPassWord)
                    }
                    this.$router.push({
                            path: "/cmdb/WebSSH",
                            name:'SSH',
                            params:params  
                        });
                }else{
                     this.$message({
                        type: 'error',
                        message: 'SSH登录失败,请重新再试!'
                        }); 
                    return false
                }
          })
           
           
            // this.$refs[sshLoginForm].validate((valid)=>{
            //   if(valid){
            //       console.log(this.sshLoginForm)
                  
                
            //   }else{
            //     //   this.submsg('提交失败,请核查提交数据!')
            //       return false
            //   }
            // })
       
       } ,
       loginHost(){
        //    alert(this.hostToken.sshToken)
           if(this.hostToken.sshToken==this.sshTokens[0]){
            //    alert(this.hostToken.sshToken)
               let routeUrl = this.$router.resolve({
                    path: "/cmdb/WebSSH",
                    
                });
                window.open(routeUrl .href, '_blank');
           }
           else{
               alert('口令不正确')

           }
            this.hostToken.sshToken=''
           
       }


    },
}
</script>

<style lang="scss" scoped>

.serverManage{
    background-color: white;

}
.bj{
    
    padding: 0px;
    text-align:center;
    font-size:1.5rem;
    display: table-cell;
    vertical-align:middle
}
div.clock{
    padding: 3px 0 ;
    position: relative;
    top:-50px;
    right:30px;
}   
.serverManage /deep/ .el-card__body{
    position: relative;
    top: -30px;
    .toolbar{
        position: relative;
        right: -20px;
    }
}
</style>