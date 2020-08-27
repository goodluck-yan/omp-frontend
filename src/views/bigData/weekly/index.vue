<template>
    <div>
        <el-card class="priceMerge">
            <div slot="header">
                <h2 class="bj">报价整合-指数计算</h2>
                <clock class="clock" type="text"></clock>
            </div>
            <el-form ref="priceForm" :rules="rules" :model="priceForm" label-width="80px" size="mini" :inline="true">
                <br>
                <el-form-item label="选择日期" required >
                    <el-col :span="11">
                        <el-form-item prop="date">
                            <el-date-picker type="date" placeholder="日期请选择本周三" v-model="priceForm.date" value-format='yyyy-MM-dd' style="width: 175px;" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="网站报价" prop="priceWebsite" required>
                    <el-input v-model="priceForm.priceWebsite" style='width:80px'></el-input>
                </el-form-item>
                <el-form-item label="席位报价" prop="reportPeriod" required>
                    <el-input v-model="priceForm.reportPeriod" style='width:80px'></el-input>
                </el-form-item>
                <!-- <br> -->
                <el-form-item label="专业市场" prop="proMarket" required>
                    <el-checkbox-group v-model="priceForm.proMarket">
                        <el-checkbox label="中国物流与采购联合会" name="proMarket"></el-checkbox>
                        <el-checkbox label="广东" name="proMarket"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="指数类型" prop="indexType" required>
                    <el-select v-model="priceForm.indexType"  style='width:130px'>
                        <el-option label="周指数" value="周指数"></el-option>
                        <el-option label="月指数" value="月指数"></el-option>
                        <el-option label="季度指数" value="季度指数"></el-option>
                        <el-option label="年指数" value="年指数"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button plain type="primary" @click="priceSubmit('priceForm')">提交</el-button>
                    <el-button @click="resetForm('priceForm')">重置</el-button>
                    <el-button @click="downFile()">导出文件</el-button>

                </el-form-item>
            </el-form>
        </el-card>

      
    </div>
</template>
<script>
import clock from '@/components/Clock'
import {formatDate} from '@/utils/datefmt.js'
import {post_price_data} from  '@/api/bigData/postPriceDate.js'



const tody = new Date();
  export default {
    components:{
        clock,  
    },
    data() {
      return {
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }, 
        },
        priceForm: {
          date: '',
          priceWebsite: 0.62,
          reportPeriod: 0.15,
          proMarket:['中国物流与采购联合会','广东'],
          indexType:'周指数',
        },
        suc_resp:'',
        rules:{
            date:[
                {type:'string',required:true,message:'日期请选择本周三',trigger:'change'}
            ],
            priceWebsite:[
                { required: true, message: '请输入网站报价', trigger: 'blur' },
                { type: 'number',min: 0.55, max: 0.65, message: '范围在 0.55 到 0.65 个字符', trigger: 'blur' }
            ],
            reportPeriod:[
                { required: true, message: '请输入席位报价', trigger: 'blur' },
                { type: 'number',min: 0.10, max: 0.20, message: '范围在 0.10 到 0.20 个字符', trigger: 'blur' }
            ],
            proMarket:[
                { type: 'array', required: true, message: '请至少选择一个专业市场', trigger: 'change' }
            ],
            indexType:[
                { required: true, message: '请选择指数类型为周指数', trigger: 'change' }
            ]
        },
      };
    },
    methods: {
        downFile(){
            let suc_res=this.suc_resp
            for(let i=0; i<suc_res.length; i++) {
                window.setTimeout(() => {
                    this.submsg(this.priceForm.proMarket[i]+":" +suc_res[i].status)
                    this.download(suc_res[i].exportExcelParam)
                }, 500)
            }
        },
        download(url) {
            var iframe =document.createElement("iframe")
            iframe.style.display = "none"; // 防止影响页面
            iframe.style.height = 0; // 防止影响页面
            iframe.src = url;
            document.body.appendChild(iframe);
            setTimeout(() =>{
                document.body.removeChild(iframe);
                iframe.remove();
                
                },400);  
        },

      priceSubmit(priceForm) {
          this.$refs[priceForm].validate((valid)=>{
              if(valid){    
                  this.submsg('提交成功,开始整合计算!')
                //   console.log("开始整合计算")
                  let price_data=this.priceForm 
                  this.post_price_data(price_data) 
                
              }else{
                  this.submsg('提交失败,请核查提交数据!')
                  return false
              }
          })
        
        // setTimeout(() =>{
        //     let suc_res=this.suc_resp
        //     for (var i in suc_res){
        //         this.submsg(this.priceForm.proMarket[i]+":"+suc_res[i].status)
        //         console.log(typeof suc_res[i].exportExcelParam)
        //         window.open(suc_res[i].exportExcelParam)
        //     }
            
        // },10000);      
      },
    post_price_data(price_data){  
            post_price_data(price_data).then(
                res=>{   
                    if(res.status == 200){
                        this.suc_resp=res.data.message
                    }
                }
            )
        },
    resetForm(priceForm) {
        this.$refs[priceForm].resetFields();
      },
    //   提示信息
     submsg(msg){
          this.$notify({
            title:'提示',
            message: msg,
            type:'seccess',
            duration:10000,
            // offset: 80,
        });
      },
    },
 
  };
</script>
<style lang="scss" scoped>

.priceMerge{
    background-color: white;
}
// .bj{
    
//     padding: 0px;
//     text-align:center;
//     font-size:1.5rem;
//     display: table-cell;
//     vertical-align:middle
// }

div.clock{
    padding: 3px 0 ;
    position: relative;
    top:-50px;
    right: -50px;
    width: 300px;
    height: 40px;
} 
.priceMerge /deep/ .el-card__body{
    position: relative;
    top: -2px;
    .toolbar{
        position: relative;
        right: 20px;
    }
}
</style>